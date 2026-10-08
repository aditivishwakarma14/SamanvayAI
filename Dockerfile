# ---------- 1. build the React frontend ----------
FROM node:22-slim AS frontend
WORKDIR /build
COPY frontend/package*.json ./
RUN npm install
COPY frontend ./
ARG VITE_RAZORPAY_KEY_ID=""
ENV VITE_RAZORPAY_KEY_ID=$VITE_RAZORPAY_KEY_ID
RUN npm run build

# ---------- 2. backend services + built frontend ----------
FROM node:22-slim
WORKDIR /app

COPY backend/package*.json ./
RUN npm install --omit=dev

COPY backend/gateway/package*.json ./gateway/
COPY backend/services/auth/package*.json ./services/auth/
COPY backend/services/chat/package*.json ./services/chat/
COPY backend/services/agent/package*.json ./services/agent/
COPY backend/services/billing/package*.json ./services/billing/
RUN for d in gateway services/auth services/chat services/agent services/billing; do \
      (cd "$d" && npm install --omit=dev) || exit 1; \
    done

COPY backend/gateway ./gateway
COPY backend/services ./services
COPY backend/shared ./shared
COPY backend/start-all.sh ./start-all.sh
RUN sed -i 's/\r$//' ./start-all.sh && chmod +x ./start-all.sh

COPY --from=frontend /build/dist ./public

ENV NODE_ENV=production
EXPOSE 10000
CMD ["./start-all.sh"]