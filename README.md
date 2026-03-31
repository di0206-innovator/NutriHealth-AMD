# NutriLens — Personalised Food Intelligence

## Problem Statement Alignment

NutriLens directly addresses the AMD Slingshot challenge: it helps individuals make 
better food choices and build healthier eating habits by combining Google Gemini's 
vision AI with personalised user profiles stored in Firebase. Every analysis is 
tailored to the user's specific health goal, dietary restrictions, and activity level — 
turning generic calorie counts into actionable, personal nutrition guidance.

## Live Demo
[Cloud Run URL here]

## Google Services Used

| Service | Purpose | Where |
|---|---|---|
| Google Gemini 1.5 Pro Vision | Food identification + personalised nutrition analysis | server/services/gemini_service.py |
| Firebase Authentication | Anonymous auth securing all Firestore reads/writes | client/src/firebase.js |
| Google Firestore | User health profiles + meal history persistence | client/src/hooks/useMeals.js |
| Google Cloud Run | Production deployment with auto-scaling | Dockerfile + cloudbuild.yaml |

## Architecture
```
React Frontend (Vite)
       ↓ HTTPS
FastAPI Backend (Cloud Run)
       ↓                    ↓
Gemini 1.5 Pro        Firebase Admin SDK
(food analysis)       (server-side writes)
                           ↓
                    Firestore Database
                    (meal history + profiles)
```

## Local Setup
```bash
# 1. Backend
cd server && pip install -r requirements.txt
cp .env.example .env  # Fill in GEMINI_API_KEY + Firebase config
uvicorn main:app --reload --port 8080

# 2. Frontend  
cd client && npm install
cp .env.example .env  # Fill in VITE_ Firebase config + VITE_API_URL
npm run dev
```

## Deploy to Cloud Run
```bash
gcloud run deploy nutrilens \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=YOUR_KEY
```

## Running Tests
```bash
cd server && pytest tests/ -v
cd client && npm run test
```