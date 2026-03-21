<div align="center">

# 🛡️ DeepGuard v2

### Advanced AI-Powered Deepfake Detection System

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Flask](https://img.shields.io/badge/Flask-3.0-000000?style=flat-square&logo=flask)](https://flask.palletsprojects.com)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.x-EE4C2C?style=flat-square&logo=pytorch)](https://pytorch.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

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
├── weights/                 # ⚠️ NOT in Git — store .pth files here locally
│   ├── convnextv2_model.pth
│   ├── xception_model.pth
│   └── resnext_lstm_model.pth
└── README.md
```

> ⚠️ **The `weights/` folder is excluded from GitHub** (files exceed 100MB). You must download and place the `.pth` model files manually before running locally.

---

## 🚀 Local Setup Guide

You need **Python 3.10+** and **Node.js 18+** installed.

### Step 1 — Clone the Repository
```bash
git clone https://github.com/omkarph1/DeepGuard.git
cd DeepGuard
```

### Step 2 — Backend Setup (Flask API)
```bash
cd backend

# Create a virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS / Linux:
source venv/bin/activate

# Install all ML dependencies
pip install -r requirements.txt

# Place your .pth weight files inside ../weights/ then start the server
python main.py
# ✅ API running on http://localhost:8000
```

### Step 3 — Frontend Setup (React)
Open a **new terminal window**:
```bash
cd frontend

# Install packages
npm install

# Start the dev server
npm run dev
# ✅ UI running on http://localhost:5173
```

### Step 4 — Usage
1. Open `http://localhost:5173` in your browser
2. Go to the **Detect** page
3. Upload an `.mp4`, `.avi`, `.mov`, or `.mkv` video file
4. Click **Run Video Analysis**
5. Watch the real-time SSE stream process each stage live
6. Review the full confidence breakdown and download your PDF report

---

## 📊 Dataset

The models were trained on a curated ensemble of **343,000+ images** sourced from 17 deepfake and real face datasets including:
- **FaceForensics++** (FF++)
- **Celeb-DF v2**
- **DFDC (DeepFake Detection Challenge)**
- **FaceShifter**, **Face2Face**, **NeuralTextures**
- Custom scraped real-face data from public sources

Training Hardware: **Kaggle T4×2 GPUs** | CUDA 11.8 | Mixed Precision FP16

---

<div align="center">
  <strong>Built for research and educational purposes.</strong><br/>
  <em>DeepGuard v2 predictions should be treated as forensic indicators, not absolute conclusions.</em>
</div>
