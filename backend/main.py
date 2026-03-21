import os
import uuid
import json
import time
import torch
import base64
from io import BytesIO
from flask import Flask, request, Response, jsonify
from flask_cors import CORS

from inference import load_models, extract_faces, run_inference, ensemble_vote

app = Flask(__name__)
CORS(app, origins=["*"])

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Device configuration
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"==================================================")
print(f"🛡️ DeepGuard v2 Backend Starting...")
print(f"   Device: {device}")
print(f"==================================================")

# Load models globally at startup
GLOBAL_MODELS = load_models(device)

def sse_event(data, event=None):
    """Format a Server-Sent Event message."""
    msg = ""
    if event:
        msg += f"event: {event}\n"
    msg += f"data: {json.dumps(data)}\n\n"
    return msg

@app.route("/api/health", methods=["GET"])
def health():
    """Health check endpoint."""
    return jsonify({
        "status": "healthy",
        "version": "2.0.0",
        "device": str(device),
        "models_loaded": {k: (v is not None) for k, v in GLOBAL_MODELS.items()}
    })

@app.route("/api/detect", methods=["POST"])
def detect():
    """
    Accept a video file upload and run deepfake detection.
    Returns an SSE stream with progress updates and final results.
    """
    if "video" not in request.files:
        return jsonify({"error": "No video file provided"}), 400

    video = request.files["video"]
    if video.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    # Save uploaded video
    session_id = str(uuid.uuid4())
    video_path = os.path.join(UPLOAD_DIR, f"{session_id}_{video.filename}")
    video.save(video_path)

    def generate():
        start_time = time.time()
        try:
            # Stage 0: Received
            yield sse_event({"type": "stage", "stage": 0})
            yield sse_event({"type": "log", "message": f"[00:00] Video received: {video.filename}"})
            time.sleep(0.5)

            # Stage 1: Extracting faces
            yield sse_event({"type": "stage", "stage": 1})
            yield sse_event({"type": "log", "message": f"[{int(time.time() - start_time):02d}s] [Stage 1] Extracting faces with MTCNN..."})
            
            # --- ACTUAL FACE EXTRACTION ---
            faces_pil = extract_faces(video_path, device, max_frames=20)
            
            if not faces_pil:
                yield sse_event({"type": "log", "message": "❌ No faces detected in video."})
                yield sse_event({"type": "error", "message": "No faces detected in video."})
                return
                
            yield sse_event({"type": "log", "message": f"[{int(time.time() - start_time):02d}s] Found {len(faces_pil)} face regions for analysis"})

            # Convert to base64 for frontend
            frames_b64 = []
            for face_pil in faces_pil:
                buffered = BytesIO()
                face_pil.resize((150, 150)).save(buffered, format="JPEG")
                img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
                frames_b64.append(f"data:image/jpeg;base64,{img_str}")

            # Stage 2: Model Inference
            yield sse_event({"type": "stage", "stage": 2})
            yield sse_event({"type": "log", "message": "Running 3 models in parallel with TTA..."})
            
            # --- ACTUAL PARALLEL INFERENCE ---
            results = run_inference(faces_pil, GLOBAL_MODELS, device)
            
            # Injecting accuracies and descriptions manually for UI consistency
            for model in results:
                if "ConvNeXt" in model["name"]:
                    model["accuracy"] = "96.01%"
                    model["description"] = "Spatial texture artifact detection"
                elif "Xception" in model["name"]:
                    model["accuracy"] = "92.35%"
                    model["description"] = "Frequency/GAN compression noise detection"
                else:
                    model["accuracy"] = "94.00%"
                    model["description"] = "Temporal flickering detection across frames"
                
                yield sse_event({
                    "type": "model_result",
                    "model": model
                })
                yield sse_event({
                    "type": "log",
                    "message": f"[{int(time.time() - start_time):02d}s] {model['name']} → {model['label']} ({model['fake_prob']*100:.1f}% confidence)"
                })

            # Stage 3: Voting
            yield sse_event({"type": "stage", "stage": 3})
            yield sse_event({"type": "log", "message": "Majority voting..."})
            
            # --- ACTUAL ENSEMBLE ---
            final_res = ensemble_vote(results)

            fake_count = sum(1 for m in results if m["label"] == "FAKE")
            yield sse_event({"type": "log", "message": f"[{int(time.time() - start_time):02d}s] Majority voting: {fake_count}/{len(results)} models → {final_res['verdict']}"})
            yield sse_event({"type": "log", "message": f"Ensemble confidence: {final_res['ensemble_fake_prob']*100:.1f}% FAKE"})

            # Stage 4: Done
            yield sse_event({"type": "stage", "stage": 4})
            yield sse_event({"type": "log", "message": f"[{int(time.time() - start_time):02d}s] ✓ Analysis complete."})

            # Final result
            yield sse_event({
                "type": "final_result",
                "result": {
                    "verdict": final_res["verdict"],
                    "confidence_tier": final_res["confidence_tier"],
                    "ensemble_fake_prob": round(final_res["ensemble_fake_prob"], 4),
                    "ensemble_real_prob": round(final_res["ensemble_real_prob"], 4),
                    "filename": video.filename,
                    "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
                    "total_frames_analyzed": len(faces_pil),
                    "faces_extracted": len(faces_pil),
                    "models": results,
                    "frames": frames_b64[:5],  # Send up to 5 face frames for the UI
                }
            })

        except Exception as e:
            import traceback
            traceback.print_exc()
            yield sse_event({"type": "error", "message": str(e)})
        
        finally:
            # Clean up uploaded video
            if os.path.exists(video_path):
                os.remove(video_path)

    return Response(
        generate(),
        mimetype="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        }
    )

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7860, debug=False)
