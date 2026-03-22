<div align="center">

# 🛡️ DeepGuard v2

### Advanced AI-Powered Deepfake Detection System

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Flask](https://img.shields.io/badge/Flask-3.0-000000?style=flat-square&logo=flask)](https://flask.palletsprojects.com)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.x-EE4C2C?style=flat-square&logo=pytorch)](https://pytorch.org)

**[🚀 Try the Live Demo Here](https://deep-guard-psi.vercel.app/)**

**DeepGuard v2** is a full-stack, AI-powered forensic web application that detects synthetic face manipulation — deepfakes — inside uploaded video files. It orchestrates a tri-model deep learning ensemble inside a real-time Flask backend, connected to a 3D-animated React dashboard via live Server-Sent Events (SSE).

</div>

---

## 📐 System Overview

```
Video Upload ──► MTCNN Face Extraction ──► 3-Model Parallel Inference
                                                     │
                                        ┌────────────┼────────────┐
                                        ▼            ▼            ▼
                                   ConvNeXt V2   XceptionNet  ResNeXt-BiLSTM
                                   (Spatial)     (Frequency)  (Temporal)
                                        │            │            │
                                        └────────────┼────────────┘
                                                     ▼
                                          Test-Time Augmentation (TTA)
                                                     ▼
                                          Majority Consensus Voting
                                                     ▼
                                        Final Verdict (streamed live via SSE)
```

---

## 🧠 5-Stage Detection Pipeline

### Stage 1 — MTCNN Face Extraction
Every frame of the uploaded video is scanned by **MTCNN (Multi-task Cascaded Convolutional Networks)** — a three-stage cascade network (P-Net → R-Net → O-Net) that precisely detects and crops facial regions. Only faces are sent to inference, filtering out irrelevant background data.

### Stage 2 — Tri-Model Parallel Inference
Three independent, distinctly specialized neural networks run simultaneously on each extracted face:

| Model | Version | Specialization | Accuracy | AUC |
|---|---|---|---|---|
| **ConvNeXt V2** | v2 | Spatial texture & jawline artifacts | 96.01% | 0.989 |
| **XceptionNet** | v3 | GAN frequency patterns & spectral noise | 92.35% | 0.971 |
| **ResNeXt50-BiLSTM** | v2 | Temporal flickering & inter-frame inconsistency | 94.00% | 0.978 |

- **ConvNeXt V2** — Detects spatial anomalies: jawline seams, unnatural skin smoothing, epidermal inconsistencies. Uses Global Response Normalization (GRN) and 7×7 convolutional patch kernels.
- **XceptionNet** — Excels at invisible frequency-domain artifacts from GANs and diffusion models. Depthwise separable convolutions decode spectral compression noise.
- **ResNeXt50-BiLSTM** — Reads a bidirectional sequence of 15 faces to catch temporal flickering and biological kinetics violations (muscle contortions, rPPG disruptions) that static models miss.

### Stage 3 — Test-Time Augmentation (TTA)
Each face is applied with 4 augmentations (Original, H-Flip, Center Crop, Color Jitter) before inference. This produces **12 independent predictions per face** across the 3 models, eliminating variance and making the final confidence more robust.

### Stage 4 — Majority Consensus Voting
A democratic threshold prevents aggressive false positives. **At least 2 out of 3 models must agree** to classify a video as `FAKE`. A single dissenting model is not enough — this protects real videos from mis-classification.

### Stage 5 — Final Verdict & Live Reporting
The ensemble confidence, individual model scores, and final verdict are **streamed directly to the frontend in real time** via SSE. The user sees results as they arrive — no loading screen, no waiting. An auto-generated PDF report is also available for download.

---

## ⚙️ Technology Stack

### Backend
| Layer | Technology |
|---|---|
| API Framework | Flask + Flask-CORS |
| Streaming | Server-Sent Events (SSE) |
| Deep Learning | PyTorch 2.x, `timm` |
| Face Detection | `facenet-pytorch` (MTCNN) |
| Computer Vision | OpenCV (`cv2`) |
| Image Processing | Pillow, NumPy |

### Frontend
| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Styling | TailwindCSS |
| Animations | Framer Motion |
| 3D Graphics | React Three Fiber + Drei |
| Charts | Recharts |
| PDF Export | jsPDF + html2canvas |

---

## 🗂️ Project Structure

```
deepguardv2/
├── backend/
│   ├── main.py              # Flask SSE API server (port 8000)
│   ├── inference.py         # Full pipeline orchestration
│   ├── requirements.txt     # Python dependencies
│   ├── models/              # PyTorch model class definitions
│   │   ├── convnext_model.py
│   │   ├── xception_model.py
│   │   └── resnext_bilstm_model.py
│   └── utils/               # Preprocessing helpers
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.jsx  # Hero page with 3D animations
│   │   │   ├── Detect.jsx   # Upload + real-time analysis UI
│   │   │   ├── About.jsx    # Model theory & dataset info
│   │   │   └── HowItWorks.jsx # 5-stage pipeline walkthrough
│   │   ├── components/
│   │   │   ├── UploadZone.jsx
│   │   │   ├── ResultsPanel.jsx
│   │   │   ├── ProgressTerminal.jsx
│   │   │   └── HeroScene.jsx  # Three.js 3D backgrounds
│   │   └── index.css        # Global design system
│   ├── package.json
│   └── vite.config.js
└── README.md
```

> ☁️ **Cloud Architecture Note**: Weight files are no longer stored locally. The backend downloads the `.pth` ensemble directly from a private Hugging Face Model Space at runtime via `huggingface_hub`.

---

## 🚀 Deployment Architecture

DeepGuard v2 is fully cloud-native, split between Vercel (Frontend) and Hugging Face Spaces (Backend).

### 1. Backend API (Hugging Face Spaces)
The Flask backend runs in a lightweight Docker container on Hugging Face Spaces. 
- It dynamically pulls the ensemble weights from a private Hugging Face weights repository using a secure `HF_TOKEN`.
- It uses a CPU-only PyTorch wheel and `opencv-python-headless` for highly optimized, low-memory inference on Free Tier HF Spaces.
- Served via `gunicorn` on port `7860`.

### 2. Frontend (Vercel)
The React/Vite dashboard is deployed on Vercel.
- Communicates with the backend API via environment variable `VITE_API_URL`.
- Client-side routing is handled securely with a standard `vercel.json` config.

*(To run locally, you can still clone the repo, `npm install` the frontend, `pip install -r requirements.txt` the backend, and set your `HF_TOKEN` in a `.env` file!)*

### Step 4 — Usage
1. Open website in your browser
2. Go to the **Detect** page
3. Upload an `.mp4`, `.avi`, `.mov`, or `.mkv` video file
4. Click **Run Video Analysis**
5. Watch the real-time SSE stream process each stage live
6. Review the full confidence breakdown and download your PDF report

---

## 📊 Dataset
The models were trained on a perfectly balanced ensemble of **288,184 images** (144,092 Real, 144,092 Fake) sourced from **10+ public datasets** spanning **17 manipulation techniques**:

### 17 Manipulation Types
1. **Face2Face** (Expression Transfer)
2. **FaceSwap**, **FaceShifter**, **DeepFakes**, **Deepfake (DFDC)**, **Celeb-DF swaps** (Identity Swap)
3. **NeuralTextures** (Texture Synthesis)
4. **GAN-generated faces**, **StyleGAN**, **StyleGAN2**, **PGGAN**, **BEGAN**, **CramerGAN**, **MMDGAN** (Full Synthesis)
5. **StarGAN**, **AttGAN** (Attribute Manipulation)

### Data Sources
- **Real:** FaceForensics++, Celeb-DF v2, DFDC, 140K Real Faces, Custom scraped data.
- **Fake:** FF++ C23, Celeb-DF v2, DFDC, Artifact GAN dataset.

**Preprocessing:** All images are **MTCNN-verified face crops**, deduplicated via perceptual hashing, and perfectly balanced 50/50.

Training Hardware: **Kaggle T4×2 GPUs** | CUDA 11.8 | Mixed Precision FP16

---

<div align="center">
  <strong>Built for research and educational purposes.</strong><br/>
  <em>DeepGuard v2 predictions should be treated as forensic indicators, not absolute conclusions.</em>
</div>
