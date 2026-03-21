"""
DeepGuard v2 — Inference Module
Handles model loading, face extraction, TTA, and ensemble voting.
"""

import os
import cv2
import torch
import numpy as np
from PIL import Image
from torchvision import transforms as T
from facenet_pytorch import MTCNN
import concurrent.futures

from models.convnext_model import ConvNeXtV2Deepfake
from models.xception_model import XceptionDeepfake
from models.resnext_bilstm_model import ResNeXtBiLSTM

from huggingface_hub import hf_hub_download

WEIGHTS_REPO = "Omkarpp/deepguard-v2-weights"

def get_weight_path(filename):
    return hf_hub_download(
        repo_id=WEIGHTS_REPO, 
        filename=filename, 
        token=os.environ.get("HF_TOKEN")
    )

WEIGHT_FILES = {
    "convnext_v2": "best_convnextv2_v2.pth",
    "xception_v3": "best_xception_v3.pth",
    "resnext_bilstm_v2": "best_resnext_bilstm_v2.pth",
}

def load_models(device):
    """
    Load all three model weights.
    Returns a dict of loaded models ready for inference.
    """
    models = {}
    
    # ConvNeXt V2
    if True: # We will fetch dynamically
        print("  Loading ConvNeXt V2...")
        model = ConvNeXtV2Deepfake(num_classes=2)
        model_path = get_weight_path(WEIGHT_FILES["convnext_v2"])
        model.load_state_dict(torch.load(model_path, map_location=device, weights_only=True))
        model.to(device)
        model.eval()
        models["convnext_v2"] = model
    else:
        print(f"  ⚠️ Weight file not found: {WEIGHT_FILES['convnext_v2']}")
        models["convnext_v2"] = None

    # XceptionNet V3
    if True:
        print("  Loading XceptionNet V3...")
        model = XceptionDeepfake(num_classes=2)
        model_path = get_weight_path(WEIGHT_FILES["xception_v3"])
        model.load_state_dict(torch.load(model_path, map_location=device, weights_only=True))
        model.to(device)
        model.eval()
        models["xception_v3"] = model
    else:
        print(f"  ⚠️ Weight file not found: {WEIGHT_FILES['xception_v3']}")
        models["xception_v3"] = None

    # ResNeXt50-BiLSTM
    if True:
        print("  Loading ResNeXt50-BiLSTM...")
        model = ResNeXtBiLSTM(num_classes=2)
        model_path = get_weight_path(WEIGHT_FILES["resnext_bilstm_v2"])
        model.load_state_dict(torch.load(model_path, map_location=device, weights_only=True))
        model.to(device)
        model.eval()
        models["resnext_bilstm_v2"] = model
    else:
        print(f"  ⚠️ Weight file not found: {WEIGHT_FILES['resnext_bilstm_v2']}")
        models["resnext_bilstm_v2"] = None

    return models


def extract_faces(video_path, device, max_frames=20):
    """
    Extract face regions from video frames using MTCNN.
    Returns a tuple: (faces_pil, extracted_faces_base64)
    """
    mtcnn = MTCNN(margin=20, keep_all=False, post_process=False, device=device)
    
    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    
    if total_frames == 0:
        return [], []

    # Calculate frame stride to evenly sample max_frames
    stride = max(1, total_frames // max_frames)
    
    faces = []
    frames_b64 = []  # We will populate this in main.py if needed, or handle it there
    
    frame_idx = 0
    extracted_count = 0
    while cap.isOpened() and extracted_count < max_frames:
        ret, frame = cap.read()
        if not ret:
            break
            
        if frame_idx % stride == 0:
            # Convert BGR to RGB
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            img = Image.fromarray(frame)
            
            # Detect face
            boxes, _ = mtcnn.detect(img)
            if boxes is not None and len(boxes) > 0:
                box = boxes[0].tolist()
                # Ensure box bounds are within image
                x1, y1, x2, y2 = [int(b) for b in box]
                x1, y1 = max(0, x1), max(0, y1)
                x2, y2 = min(img.width, x2), min(img.height, y2)
                
                if x2 > x1 and y2 > y1:
                    # Crop and resize to 299x299 (max needed, can be resized down for 224)
                    face_pil = img.crop((x1, y1, x2, y2)).resize((299, 299), Image.BILINEAR)
                    faces.append(face_pil)
                    extracted_count += 1
                    
        frame_idx += 1

    cap.release()
    return faces


def get_transforms(model_name):
    if model_name == "xception_v3":
        size = 299
        mean = (0.5, 0.5, 0.5)
        std = (0.5, 0.5, 0.5)
    else:
        size = 224
        mean = (0.485, 0.456, 0.406)
        std = (0.229, 0.224, 0.225)
        
    # 4-view TTA: Original, H-Flip, Color Jitter, Center Crop
    tta_transforms = [
        T.Compose([
            T.Resize((size, size)),
            T.ToTensor(),
            T.Normalize(mean, std)
        ]),
        T.Compose([
            T.Resize((size, size)),
            T.RandomHorizontalFlip(p=1.0),
            T.ToTensor(),
            T.Normalize(mean, std)
        ]),
        T.Compose([
            T.Resize((size, size)),
            T.ColorJitter(brightness=0.2, contrast=0.2),
            T.ToTensor(),
            T.Normalize(mean, std)
        ]),
        T.Compose([
            T.Resize((size + 32, size + 32)),
            T.CenterCrop(size),
            T.ToTensor(),
            T.Normalize(mean, std)
        ])
    ]
    return tta_transforms


def run_single_model(name, model, faces, device):
    """Run inference for a single model on a list of faces with TTA."""
    if model is None or len(faces) == 0:
        return None
        
    transforms = get_transforms(name)
    all_probs = []
    
    with torch.no_grad():
        for face_pil in faces:
            # Apply TTA: get 4 augmented versions of the face
            batch = torch.stack([t(face_pil) for t in transforms]).to(device)
            # Forward pass (Batch size 4)
            logits = model(batch)
            probs = torch.nn.functional.softmax(logits, dim=1)
            # Prob of FAKE is index 1
            fake_probs = probs[:, 1].cpu().numpy()
            
            # Average TTA predictions for this face
            avg_face_prob = np.mean(fake_probs)
            all_probs.append(avg_face_prob)
            
    # Average across all extracted faces in the video
    final_fake_prob = float(np.mean(all_probs))
    
    return {
        "model": name,
        "fake_prob": final_fake_prob,
        "real_prob": 1.0 - final_fake_prob,
        "label": "FAKE" if final_fake_prob > 0.50 else "REAL",
    }


def run_inference(faces, models, device):
    """
    Run all three models on extracted faces using ThreadPoolExecutor for parallelism.
    """
    results = []
    if len(faces) == 0:
        return results

    # Run in parallel using 3 workers
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
        future_to_model = {
            executor.submit(run_single_model, name, model, faces, device): name
            for name, model in models.items()
        }
        
        for future in concurrent.futures.as_completed(future_to_model):
            name = future_to_model[future]
            try:
                res = future.result()
                if res is not None:
                    # Map to expected display names
                    display_name = {
                        "convnext_v2": "ConvNeXt V2",
                        "xception_v3": "XceptionNet",
                        "resnext_bilstm_v2": "ResNeXt50-BiLSTM"
                    }.get(name, name)
                    
                    res["name"] = display_name
                    results.append(res)
            except Exception as exc:
                print(f"Model {name} generated an exception: {exc}")
                
    return results


def ensemble_vote(model_results):
    """
    Majority voting ensemble
    """
    if not model_results:
        return {
            "verdict": "UNKNOWN",
            "confidence_tier": "UNKNOWN",
            "ensemble_fake_prob": 0.0,
            "ensemble_real_prob": 0.0,
        }
        
    fake_count = sum(1 for r in model_results if r["label"] == "FAKE")
    verdict = "FAKE" if fake_count >= (len(model_results) / 2) else "REAL"
    
    ensemble_fake = np.mean([r["fake_prob"] for r in model_results])
    ensemble_real = 1 - ensemble_fake
    
    max_prob = max(ensemble_fake, ensemble_real)
    if max_prob > 0.8:
        tier = "HIGH"
    elif max_prob > 0.6:
        tier = "MODERATE"
    else:
        tier = "BORDERLINE"
    
    return {
        "verdict": verdict,
        "confidence_tier": tier,
        "ensemble_fake_prob": float(ensemble_fake),
        "ensemble_real_prob": float(ensemble_real),
    }

