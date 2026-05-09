# 🚀 YearBeat — Guia de Desplegament

## Arquitectura de producció

```
Usuari → Firebase Hosting (frontend)
            ↓ HTTP + WebSocket
         Cloud Run (backend, europe-west1)
            ↓              ↓
    Neon PostgreSQL    Upstash Redis
```

---

## Prerequisits

1. **Google Cloud CLI** instal·lat → [gcloud CLI](https://cloud.google.com/sdk/docs/install)
2. **Firebase CLI** instal·lat → `npm i -g firebase-tools`
3. Projecte de Firebase: `yearbeat-2fad8`
4. GCP project vinculat (es crea automàticament amb Firebase)

### Primer cop: activar APIs necessàries

```bash
gcloud auth login
gcloud config set project yearbeat-2fad8

# Activar Cloud Run, Cloud Build i Container Registry
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

---

## 1️⃣ Desplegar el backend (Cloud Run)

### a) Configurar variables d'entorn

Copia la plantilla i posa les credencials reals:

```bash
cp env.yaml.example env.yaml
```

Edita `env.yaml` amb els valors reals de Neon, Upstash i Firebase.

### b) Executar el deploy

Des de l'arrel del projecte:

```bash
# Linux/Mac:
chmod +x deploy-backend.sh
./deploy-backend.sh

# Windows (PowerShell):
gcloud config set project yearbeat-2fad8
gcloud builds submit --tag gcr.io/yearbeat-2fad8/yearbeat-backend .
gcloud run deploy yearbeat-backend `
  --image gcr.io/yearbeat-2fad8/yearbeat-backend `
  --region europe-west1 `
  --platform managed `
  --port 8080 `
  --memory 512Mi `
  --cpu 1 `
  --min-instances 0 `
  --max-instances 3 `
  --timeout 300 `
  --env-vars-file env.yaml `
  --allow-unauthenticated
```

### c) Apuntar la URL

Quan acabi, Cloud Run et donarà una URL tipus:
```
https://yearbeat-backend-XXXXX-ew.a.run.app
```

Guarda-la! La necessites pel frontend.

---

## 2️⃣ Desplegar el frontend (Firebase Hosting)

### a) Configurar la URL del backend

Edita `apps/frontend/.env.production`:

```env
VITE_BACKEND_URL=https://yearbeat-backend-XXXXX-ew.a.run.app
```

### b) Build i deploy

```bash
# Build del frontend amb les variables de producció
cd apps/frontend
pnpm build

# Deploy a Firebase Hosting
firebase deploy --only hosting
```

El frontend estarà disponible a:
- `https://yearbeat-2fad8.web.app`
- `https://yearbeat-2fad8.firebaseapp.com`

---

## 📋 Variables d'entorn — Resum

### Backend (Cloud Run — `env.yaml`)

| Variable             | Descripció                              |
| -------------------- | --------------------------------------- |
| `NODE_ENV`           | `production`                            |
| `PORT`               | `8080` (Cloud Run default)              |
| `DATABASE_URL`       | Neon pooled connection string           |
| `DIRECT_URL`         | Neon direct connection string           |
| `REDIS_URL`          | Upstash Redis URL (`rediss://...`)      |
| `FRONTEND_URL`       | `https://yearbeat-2fad8.web.app`        |
| `FIREBASE_PROJECT_ID`| `yearbeat-2fad8`                        |

### Frontend (Vite — `.env.production`)

| Variable                     | Descripció                       |
| ---------------------------- | -------------------------------- |
| `VITE_BACKEND_URL`           | URL de Cloud Run                 |
| `VITE_FIREBASE_API_KEY`      | Firebase API key                 |
| `VITE_FIREBASE_AUTH_DOMAIN`  | `yearbeat-2fad8.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID`   | `yearbeat-2fad8`                 |
| `VITE_FIREBASE_APP_ID`       | Firebase App ID                  |

---

## ⚙️ Cloud Run — Configuració

| Paràmetre       | Valor  | Motiu                                |
| --------------- | ------ | ------------------------------------ |
| Min instances   | 0      | Cost $0 quan no s'usa                |
| Max instances   | 3      | Més que suficient per <100 users/dia |
| Memòria         | 512 Mi | Prou per Node.js + Prisma            |
| CPU             | 1      | Suficient                            |
| Timeout         | 300s   | Per WebSocket connections llargues   |
| Port            | 8080   | Standard Cloud Run                   |
| Regió           | eu-w1  | Proper als usuaris (Europa)          |

### Cold start

Amb `min-instances=0`, la primera petició després d'inactivitat triga ~3-5 segons.
Durant una partida activa, la instància es manté viva.

---

## 🐛 Debug

### Logs del backend:
```bash
gcloud run services logs read yearbeat-backend --region europe-west1
```

### Estat del servei:
```bash
gcloud run services describe yearbeat-backend --region europe-west1
```
