# LabelIQ 🛡️
### An NLP-Driven Framework for Detecting Misleading Health Claims on Indian Packaged Food Labels

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://mongodb.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

---

## 📌 What is LabelIQ?

LabelIQ is a full-stack AI-powered web application that automatically verifies health claims on Indian packaged food labels against **FSSAI (Food Safety and Standards Authority of India)** regulations.

Most food apps rely on manually curated databases. LabelIQ is different — it reads any food label image, runs it through a **multi-model AI pipeline**, and produces a detailed compliance report with:

- ✅ Per-claim legal verdict — Verified / Misleading / Illegal / Unsubstantiated
- 🔴 Dangerous ingredient interaction detection via Knowledge Graph
- 🧠 BERT-based claim classification with SHAP explainability
- 👤 Personalised health impact explanation via Gemini AI
- 📋 10+ health condition profiles (Diabetic, PCOS, Celiac, Heart, IBS, and more)

---

## 🎯 Research Contribution

Three gaps addressed that no existing system covers:

1. **FSSAI Claim Verification** — First automated system to check marketing claims against exact legal thresholds from FSSAI Advertising & Claims Regulations 2018
2. **Ingredient Interaction Knowledge Graph** — Detects dangerous additive combinations (e.g. E211 + E300 → Benzene, a WHO IARC Group 1 carcinogen)
3. **Explainable AI** — SHAP values make every model decision transparent and auditable

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         React + Vite (Frontend)         │
│   Tailwind CSS + ShadCN UI + Axios      │
└──────────────┬──────────────────────────┘
               │ HTTP / REST API
┌──────────────▼──────────────────────────┐
│        Python FastAPI (Backend)         │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │         AI Pipeline             │   │
│  │  Gemini Vision → BERT → FSSAI  │   │
│  │  Rule Engine → NetworkX Graph  │   │
│  │  → SHAP → Gemini Explanation   │   │
│  └─────────────────────────────────┘   │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         MongoDB Atlas (Database)        │
│    Users | Scans | Health Profiles      │
└─────────────────────────────────────────┘
```

---

## 🤖 AI Models Used

| Model | Purpose | Source |
|-------|---------|--------|
| Gemini 2.5 Flash | Reads label image, extracts claims + nutrition + ingredients | Google AI |
| BERT (facebook/bart-large-mnli) | Zero-shot claim classification | HuggingFace |
| FSSAI Rule Engine | Threshold-based compliance verification | Custom Python |
| NetworkX Knowledge Graph | Dangerous ingredient interaction detection | Custom + NetworkX |
| SHAP | Token-level explainability for BERT decisions | SHAP library |
| Gemini API | Plain-language personalised health explanation | Google AI |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **Vite** — Fast modern web framework
- **Tailwind CSS v4** — Utility-first styling
- **ShadCN UI** — Accessible component library
- **React Router DOM** — Client-side routing
- **Axios** — HTTP client with JWT interceptors
- **next-themes** — Dark/light mode
- **react-dropzone** — Image upload with drag-and-drop
- **react-hot-toast** — Toast notifications
- **Firebase SDK** — Google OAuth

### Backend
- **FastAPI** — High-performance Python web framework
- **Uvicorn** — ASGI server
- **Motor** — Async MongoDB driver
- **PyMongo** — MongoDB client
- **python-jose** — JWT token handling
- **bcrypt** — Password hashing
- **firebase-admin** — Firebase token verification
- **google-genai** — Gemini API SDK
- **Pillow** — Image processing
- **NetworkX** — Knowledge graph
- **Transformers** — BERT model
- **SHAP** — Explainability
- **torch** — PyTorch for model inference

### Database
- **MongoDB Atlas** — Cloud NoSQL database

---

## 📁 Project Structure

```
food-label-analyzer/
│
├── backend/                          # Python FastAPI Backend
│   ├── main.py                       # App entry point, CORS, routes registration
│   ├── database.py                   # MongoDB connection via Motor
│   ├── auth_utils.py                 # JWT creation, password hashing, token verification
│   ├── requirements.txt              # Python dependencies
│   ├── firebase-service-account.json # Firebase credentials (NOT in git)
│   ├── .env                          # Environment variables (NOT in git)
│   ├── uploads/                      # Uploaded label images (NOT in git)
│   │
│   ├── routes/
│   │   ├── auth.py                   # Register, Login, Google OAuth endpoints
│   │   ├── scan.py                   # Label analysis endpoint (main AI pipeline)
│   │   └── profile.py                # Health profile CRUD endpoints
│   │
│   └── ai/
│       ├── gemini.py                 # Gemini Vision OCR + health explanation
│       ├── fssai_engine.py           # FSSAI threshold rule engine
│       ├── graph.py                  # NetworkX ingredient interaction knowledge graph
│       ├── bert_classifier.py        # BERT zero-shot claim classification
│       └── shap_explainer.py         # SHAP token importance explainability
│
├── frontend/                         # React + Vite Frontend
│   ├── index.html
│   ├── vite.config.js                # Vite config with @ alias
│   ├── jsconfig.json                 # Path aliases for IDE
│   ├── package.json
│   ├── .env.local                    # Frontend env vars (NOT in git)
│   │
│   └── src/
│       ├── main.jsx                  # React entry point + ThemeProvider
│       ├── App.jsx                   # Routes + ProtectedRoute wrapper
│       ├── index.css                 # Tailwind + custom CSS variables
│       │
│       ├── api/
│       │   └── axios.js              # Axios instance with JWT interceptor
│       │
│       ├── firebase.js               # Firebase app init + Google provider
│       │
│       ├── hooks/
│       │   └── useGoogleAuth.js      # Google sign-in hook (popup/redirect)
│       │
│       ├── pages/
│       │   ├── Landing.jsx           # Home page with hero, stats, how it works
│       │   ├── Login.jsx             # Email + Google login
│       │   ├── Register.jsx          # Registration with password strength
│       │   ├── Scan.jsx              # 3-image upload + mode + health selector
│       │   ├── Results.jsx           # Full compliance report display
│       │   ├── Profile.jsx           # Health conditions management
│       │   └── History.jsx           # Past scans with pagination
│       │
│       └── components/
│           ├── Navbar.jsx            # Sticky navbar with theme toggle
│           ├── scan/
│           │   ├── ScanConstants.js  # Health profiles, modes, step definitions
│           │   ├── ImageUploader.jsx # 3-slot image upload (desktop + mobile)
│           │   ├── ModeSelector.jsx  # Production / Research mode toggle
│           │   ├── HealthSelector.jsx# 11 health condition selector
│           │   ├── AnalysisProgress.jsx # Animated AI pipeline steps
│           │   └── ScanFooter.jsx    # Analyze button + badges
│           └── results/
│               └── KnowledgeGraph.jsx # SVG ingredient interaction graph
│
└── README.md
```

---

## ⚡ Local Setup Guide

### Prerequisites

Make sure these are installed on your machine:
- **Python 3.10+** — [Download](https://python.org/downloads)
- **Node.js 18+** — [Download](https://nodejs.org)
- **MongoDB Compass** — [Download](https://mongodb.com/try/download/compass)
- **Git** — [Download](https://git-scm.com)

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/food-label-analyzer.git
cd food-label-analyzer
```

---

### Step 2 — Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install all dependencies
pip install -r requirements.txt
```

---

### Step 3 — Backend Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
MONGODB_URI=mongodb://localhost:27017
JWT_SECRET=your-secret-key-here-make-it-long
GEMINI_API_KEY=your-gemini-api-key-here
```

**Getting your Gemini API Key:**
- Go to https://aistudio.google.com/app/apikey
- Click **Create API Key in new project**
- Copy and paste it above

---

### Step 4 — Firebase Setup (for Google OAuth)

1. Go to https://console.firebase.google.com
2. Create a new project named `labeliq`
3. Click **Authentication** → **Get Started** → Enable **Google**
4. Click **Project Settings** → **Service Accounts** → **Generate New Private Key**
5. Download the JSON file and rename it to `firebase-service-account.json`
6. Place it inside the `backend/` folder
7. In **Project Settings** → register a **Web App** and copy the `firebaseConfig`

---

### Step 5 — Start the Backend

```bash
# Make sure venv is activated
uvicorn main:app --reload --port 8000 --host 0.0.0.0
```

You should see:
```
✅ MongoDB connected successfully
INFO: Application startup complete.
```

Open http://localhost:8000/docs to see the Swagger API documentation.

---

### Step 6 — Frontend Setup

Open a **new terminal window** (keep backend running):

```bash
cd frontend
npm install
```

---

### Step 7 — Frontend Environment Variables

Create `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:8000/api
```

---

### Step 8 — Add Firebase Config to Frontend

Open `frontend/src/firebase.js` and replace with your actual Firebase config values:

```javascript
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
}
```

---

### Step 9 — Start the Frontend

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

---

### Step 10 — Create MongoDB Database

Open MongoDB Compass and connect to `mongodb://localhost:27017`

Create a database named `foodlabeldb` with these collections:
- `users`
- `scans`

---

## 🌐 Accessing on Mobile (Same WiFi Network)

```bash
# Run frontend with host flag
npm run dev -- --host

# Run backend with host flag
uvicorn main:app --reload --port 8000 --host 0.0.0.0
```

Open `http://YOUR_PC_IP:5173` on your phone.

Find your PC IP with `ipconfig` (Windows) or `ifconfig` (Mac/Linux).

Also add your IP to Firebase **Authorized Domains** under Authentication → Settings.

---

## 🚀 Deployment Guide

### Free Deployment Stack (Recommended)

| Service | What it hosts | Free Tier |
|---------|--------------|-----------|
| **Vercel** | React Frontend | Unlimited static deploys |
| **Render.com** | FastAPI Backend | 750 hours/month |
| **MongoDB Atlas** | Database | 512MB free forever |

---

### Deploy Frontend to Vercel

1. Push your code to GitHub
2. Go to https://vercel.com and sign in with GitHub
3. Click **New Project** → Import your repository
4. Set **Root Directory** to `frontend`
5. Framework preset: **Vite**
6. Add environment variable:
   - `VITE_API_URL` = `https://your-render-backend-url.onrender.com/api`
7. Click **Deploy**

Your frontend will be live at `https://labeliq.vercel.app`

---

### Deploy Backend to Render.com

1. Go to https://render.com and sign in with GitHub
2. Click **New** → **Web Service**
3. Connect your repository
4. Configure:
   - **Name**: `labeliq-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add Environment Variables:
   - `MONGODB_URI` = your MongoDB Atlas connection string
   - `JWT_SECRET` = your secret key
   - `GEMINI_API_KEY` = your Gemini API key
6. Upload `firebase-service-account.json` content as an environment variable or use Render's Secret Files feature
7. Click **Create Web Service**

---

### Setup MongoDB Atlas (Cloud Database)

1. Go to https://cloud.mongodb.com
2. Create a free account
3. Create a **free M0 cluster**
4. Click **Connect** → **Connect your application**
5. Copy the connection string — looks like:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/foodlabeldb
   ```
6. Add it as `MONGODB_URI` in both Render and your local `.env`
7. In **Network Access** → Add `0.0.0.0/0` to allow connections from anywhere

---

### Update Frontend API URL After Deployment

In `frontend/src/api/axios.js` the `getBaseURL()` function auto-detects:
- `localhost` → uses `http://localhost:8000/api`
- Any other host → uses `http://HOSTNAME:8000/api`

For production, set the `VITE_API_URL` environment variable in Vercel to point to your Render backend URL.

---

### Update Firebase Authorized Domains

After deployment, add your Vercel domain to Firebase:
1. Firebase Console → Authentication → Settings → Authorized Domains
2. Click **Add Domain**
3. Add: `labeliq.vercel.app` (or your custom domain)

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login with email/password |
| POST | `/api/auth/google` | No | Login with Google Firebase token |
| POST | `/api/scan/analyze` | Yes | Analyze food label image |
| GET | `/api/scan/history` | Yes | Get last 50 scans |
| GET | `/api/scan/{id}` | Yes | Get specific scan result |
| GET | `/api/profile/` | Yes | Get user profile |
| PUT | `/api/profile/health` | Yes | Update health conditions |

Full interactive documentation available at `/docs` when running locally.

---

## 🔒 Security

- Passwords hashed with **bcrypt** — never stored as plain text
- All protected routes require **JWT Bearer token**
- Google OAuth tokens verified server-side via **Firebase Admin SDK**
- `.env` file and `firebase-service-account.json` excluded from git
- CORS configured to only allow specific origins

---

## 📊 FSSAI Thresholds Enforced

| Claim | Solid Threshold | Liquid Threshold |
|-------|----------------|-----------------|
| High Protein | ≥ 10g/100g | ≥ 5g/100ml |
| Source of Protein | ≥ 5g/100g | ≥ 2.5g/100ml |
| Low Fat | ≤ 3g/100g | ≤ 1.5g/100ml |
| Fat Free | ≤ 0.5g/100g | ≤ 0.5g/100ml |
| Low Sugar | ≤ 5g/100g | ≤ 2.5g/100ml |
| Sugar Free | ≤ 0.5g/100g | ≤ 0.5g/100ml |
| Low Sodium | ≤ 120mg/100g | ≤ 120mg/100ml |
| High Fibre | ≥ 6g/100g | ≥ 3g/100ml |
| Rich in Calcium | ≥ 30% RDA/100g | ≥ 15% RDA/100ml |
| Health Drink | **ALWAYS ILLEGAL** | FSS Act 2006 |

---

## 🏥 Supported Health Profiles

LabelIQ personalises analysis for 10 health conditions:

| Condition | What Gets Flagged |
|-----------|------------------|
| Diabetic | Maltodextrin, dextrose, HFCS, high sugar |
| Hypertensive | High sodium, MSG, sodium additives |
| PKU | Aspartame, phenylalanine |
| Pregnant | Nitrates, saccharin, unsafe additives |
| Lactose Intolerant | Milk solids, whey, casein, lactose |
| PCOS | Maida, trans fats, refined sugars |
| Celiac / Gluten | Wheat, barley, rye, malt, semolina |
| Heart / CVD | Palm oil, partially hydrogenated oils |
| IBS / Gut | Polyols, inulin, chicory root |
| High Uric Acid | HFCS, fructose, yeast extract |

---

## ⚠️ Known Limitations

- BERT zero-shot model (not fine-tuned) — accuracy improves with domain training
- Gemini Vision accuracy depends on image quality — blurry photos give poor results
- Knowledge graph covers 20+ documented interactions — not exhaustive
- Research Mode (BERT + SHAP) is slow on first load — models download ~1.5GB
- Free Render.com tier spins down after 15 mins inactivity — first request is slow

---

## 📄 License

This project is licensed under the MIT License.

---


## 📚 References

1. FSSAI Advertising & Claims Regulations 2018, Schedule I
2. FSSAI Labelling & Display Regulations 2020
3. FSSAI Advisory April 2024 — Health Drink Ban
4. WHO 2005 — Benzene in Soft Drinks Report
5. IARC Monographs Volume 120 — Benzene Classification
6. McCann et al. 2007 Lancet — Southampton Study (Azo Dyes)
7. EFSA 2009 — Sunset Yellow + Tartrazine Hyperactivity
8. NIH Office of Dietary Supplements — Iron + Calcium Interaction