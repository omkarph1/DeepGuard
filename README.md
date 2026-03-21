# 🛡️ DeepGuard v2: Advanced Deepfake Detection Ensemble

DeepGuard v2 is an end-to-end, AI-powered forensic application designed to detect synthetic manipulation in video files. Built on a modular architecture, DeepGuard integrates a rigorous computer vision pipeline and a **Tri-Model Ensemble Architecture** connected to a highly interactive, 3D-enhanced React frontend via Real-Time Server-Sent Events (SSE).

---

## 🧠 System Architecture

DeepGuard evaluates videos through a 5-Stage processing pipeline:

### 1. MTCNN Face Extraction
The backend parses video uploads frame-by-frame and extracts isolated facial data using **MTCNN (Multi-task Cascaded Convolutional Networks)**. It detects and crops the faces, ensuring the models only evaluate the most heavily manipulated regions of a frame.

### 2. Tri-Model Parallel Inference
The core of DeepGuard v2 relies on three distinctly specialized neural networks running inference to analyze different types of synthetic artifacts:
- **ConvNeXt V2 (Spatial Detail Extractor):** Focuses heavily on spatial anomalies, jawline inconsistencies, and micro-textural smoothing typical of auto-encoders.
- **XceptionNet v3 (Frequency Domain Analyzer):** Excels at analyzing frequency spectra and capturing invisible upconvolution noise typical of GANs and Diffusion models.
- **ResNeXt50-BiLSTM (Temporal Sequence Checker):** Evaluates faces mapped across time (15-frame sequences). By sending the features into a Recurrent Neural Network forward and backward, it detects unnatural biological kinetics and micro-expression breaking.

### 3. Test-Time Augmentation (TTA)
Each face is mathematically augmented into 4 distinct views (Original, Horizontal Flip, Center Crop, Color Jitter) before passing through the ensemble. This yields 12 independent predictions per face—drastically reducing noise and stabilizing confidence.

### 4. Majority Consensus Voting
To prevent false positives, DeepGuard employs a strict democratic threshold. Two out of the three models must agree to flag a video as **FAKE**. If only one model flags it, the system defaults to **REAL** to prevent innocent videos from being targeted.

### 5. Interactive Streaming (SSE)
Instead of waiting 30 seconds for a blank loading screen, the Flask backend streams inference logs, individual model confidences, and the final ensemble verdict directly back to the React frontend in real-time.

---

## 🛠️ Technology Stack

**Frontend Context (UI/UX)**
- **Framework:** React + Vite
- **Styling:** TailwindCSS
- **Animations:** Framer Motion
- **3D Graphics:** React Three Fiber (`@react-three/fiber`, `@react-three/drei`)
- **Charting:** Recharts

**Backend Context (API/ML)**
- **Framework:** Flask + Flask-CORS
- **AI/ML Engine:** PyTorch (`torch`, `torchvision`)
- **Computer Vision:** OpenCV (`cv2`), Facenet-PyTorch (MTCNN)
- **Data Handling:** NumPy, Pandas

---

## 🚀 How to Run Locally

To deploy DeepGuard v2 locally, you must run both the Python API and the Node.js frontend simultaneously.

### Structure Requisites
Ensure your directory looks exactly like this, with the pretrained PyTorch `.pth` weights dropped inside the `weights/` folder at the root:
```text
deepguardv2/
├── backend/
│   ├── main.py
│   ├── inference.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── weights/
│   ├── convnextv2_model.pth
│   ├── xception_model.pth
│   └── resnext_lstm_model.pth
└── README.md
```

### 1. Starting the Backend (Flask API)
Open a terminal and setup your Python environment:

```bash
cd website/backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install the required deep learning dependencies
pip install -r requirements.txt

# Start the Flask SSE server (runs on Port 5000)
python main.py
```

### 2. Starting the Frontend (React Vite)
Open a **new, separate terminal** and start the development server:

```bash
cd website/frontend

# Install node modules
npm install

# Start the interactive UI (runs on Port 5173)
npm run dev
```

### 3. Usage
- Navigate to `http://localhost:5173` in your browser.
- Verify `DEMO_MODE` is disabled in the frontend code if you intend to send real inference requests.
- Head to the **Detect** page, upload an MP4, AVI, or MOV video file format, and watch the real-time SSE stream evaluate the synthetic fidelity of the video. 

---

## ⚠️ Research Disclaimer
DeepGuard v2 is an advanced educational and analytical tool. The models (`ConvNeXt`, `Xception`, `BiLSTM`) are highly accurate on curated evaluation datasets (FaceForensics++, Celeb-DF), but no AI system is infallible. DeepGuard's predictions should be treated as forensic indications rather than absolute legal truths.
