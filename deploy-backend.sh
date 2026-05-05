#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# deploy-backend.sh — Build & deploy YearBeat backend to Cloud Run
# ─────────────────────────────────────────────────────────────
set -euo pipefail

# ── Config ───────────────────────────────────────────────────
PROJECT_ID="yearbeat-2fad8"
REGION="europe-west1"
SERVICE_NAME="yearbeat-backend"
IMAGE="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

# ── 1. Set active project ───────────────────────────────────
echo "→ Setting GCP project to ${PROJECT_ID}..."
gcloud config set project "${PROJECT_ID}"

# ── 2. Build Docker image via Cloud Build ────────────────────
echo "→ Building Docker image with Cloud Build..."
gcloud builds submit --tag "${IMAGE}" .

# ── 3. Deploy to Cloud Run ──────────────────────────────────
echo "→ Deploying to Cloud Run (${REGION})..."
gcloud run deploy "${SERVICE_NAME}" \
  --image "${IMAGE}" \
  --region "${REGION}" \
  --platform managed \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 3 \
  --timeout 300 \
  --env-vars-file env.yaml \
  --allow-unauthenticated

# ── 4. Print service URL ────────────────────────────────────
URL=$(gcloud run services describe "${SERVICE_NAME}" \
  --region "${REGION}" \
  --format "value(status.url)")

echo ""
echo "✅ Backend deployed at: ${URL}"
echo ""
echo "⚠️  Next steps:"
echo "   1. Update apps/frontend/.env.production with:"
echo "      VITE_BACKEND_URL=${URL}"
echo "   2. Deploy frontend:"
echo "      cd apps/frontend && firebase deploy --only hosting"
