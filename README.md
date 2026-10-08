# Samanvay AI

Samanvay AI is a full-stack AI assistant platform built on a microservices backend. Users sign in with Google, chat with AI agents (chat, search, coding, PDF, PPT and image generation), and use a credit-based plan system.

**Live demo:** https://samanvayai.onrender.com
*(Hosted on a free Render instance, so the first load after inactivity can take up to ~50 seconds.)*

---

## Features

- Google sign-in using Firebase Authentication
- Cookie-based sessions stored in Redis (HttpOnly, Secure, SameSite)
- AI agents for chat, web search, coding, PDF, PPT and image generation
- Credit and plan system with per-agent credit costs
- Billing service for plan upgrades
- API gateway that routes and protects all service traffic
- Responsive React UI with a chat area, message bubbles, artifacts and a billing drawer
- Dockerized, deployable as a single container

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, Axios, Redux (state) |
| API Gateway | Node.js, Express, express-http-proxy, cookie-parser, morgan |
| Services | Node.js (ESM), Express: auth, chat, agent, billing |
| Database | MongoDB (Mongoose) |
| Cache / Sessions | Redis |
| Auth | Firebase Authentication + Firebase Admin SDK |
| DevOps | Docker, Render, GitHub Actions |

## Architecture

```
Browser (React + Vite)
        |
        v
   API Gateway  (:PORT)
   - CORS, cookies, session check (Redis)
        |
        +--> /api/auth     -> Auth Service     (:8001)
        +--> /api/chat     -> Chat Service     (:8002)
        +--> /api/agent    -> Agent Service    (:8003)
        +--> /api/billing  -> Billing Service  (:8004)
        +--> /api/me       -> current user (handled in gateway)

Shared: MongoDB, Redis, shared/ utilities
```

In production, the gateway also serves the built frontend from `public/`, so the app and the API share one origin.

## Project Structure

```
SamanvayAI/
├── .github/workflows/     # CI/CD (deploy.yml)
├── backend/
│   ├── gateway/           # API gateway
│   ├── services/
│   │   ├── auth/          # Google login, sessions, credits
│   │   ├── chat/          # Chat service
│   │   ├── agent/         # AI agents
│   │   └── billing/       # Plans and payments
│   ├── shared/            # Shared code (e.g. Redis client)
│   └── start-all.sh       # Starts all services in one container
├── frontend/              # React + Vite app
└── Dockerfile             # Multi-stage build (frontend + backend)
```

## Getting Started (Local)

### Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)
- Redis (local or cloud)
- A Firebase project with Google sign-in enabled

### 1. Clone and install

```bash
git clone https://github.com/aditivishwakarma14/SamanvayAI.git
cd SamanvayAI

# backend
cd backend && npm install
cd gateway && npm install && cd ..
cd services/auth && npm install && cd ../..
cd services/chat && npm install && cd ../..
cd services/agent && npm install && cd ../..
cd services/billing && npm install && cd ../..

# frontend
cd ../frontend && npm install
```

### 2. Configure environment variables

Create a `.env` file in each service folder. Never commit these files.

**Gateway (`backend/gateway/.env`)**

```
PORT=8000
AUTH_SERVICE=http://localhost:8001
CHAT_SERVICE=http://localhost:8002
AGENT_SERVICE=http://localhost:8003
BILLING_SERVICE=http://localhost:8004
FRONTEND_URL=http://localhost:5173
REDIS_URL=redis://localhost:6379
```

**Auth service (`backend/services/auth/.env`)**

```
PORT=8001
MONGO_URI=<your MongoDB connection string>
REDIS_URL=redis://localhost:6379
FIREBASE_SERVICE_ACCOUNT_B64=<base64 of your Firebase service account JSON>
```

Other services (chat, agent, billing) need their own `PORT`, `MONGO_URI`, `REDIS_URL` and any API keys they use.

**Frontend (`frontend/.env`)**

```
VITE_API_URL=http://localhost:8000
# plus your Firebase web config (apiKey, authDomain, projectId, ...)
```

### 3. Run

Start each service (gateway, auth, chat, agent, billing) with `npm start` or `npm run dev` in its folder, then:

```bash
cd frontend
npm run dev
```

Open http://localhost:5173.

## Firebase Setup

1. Create a Firebase project and enable **Google** under Authentication, Sign-in method.
2. Add your domains under Authentication, Settings, **Authorized domains** (for example `localhost` and your deployed domain).
3. Generate a service account key (Project settings, Service accounts) and provide it to the auth service through `FIREBASE_SERVICE_ACCOUNT_B64`:

```bash
node -e "console.log(Buffer.from(require('fs').readFileSync('serviceAccountKey.json')).toString('base64'))"
```

Keep the service account key out of git and out of the Docker image.

## Deployment (Render)

The root `Dockerfile` builds the frontend, copies the backend, and runs all services using `backend/start-all.sh`. On Render:

1. Create a **Web Service** from this repository using the Dockerfile.
2. Add the environment variables listed above in the Render dashboard.
3. Set `FRONTEND_URL` to your Render URL.
4. Add the Render domain to Firebase Authorized domains.

## Security Notes

- Sessions use HttpOnly, Secure cookies backed by Redis.
- Service account keys and `.env` files must never be committed.
- Internal endpoints (such as plan updates and credit deductions) should not be exposed publicly through the gateway.

## Roadmap

- Split services into separate deployments
- Role-based access and an admin dashboard
- Usage analytics
- Code-splitting to reduce frontend bundle size

## Author

**Aditi Vishwakarma**
GitHub: [@aditivishwakarma14](https://github.com/aditivishwakarma14)

## License

This project is licensed under the MIT License. Add a `LICENSE` file if you want to publish it that way.