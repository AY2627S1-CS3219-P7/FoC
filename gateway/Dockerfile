# AI Assistance Disclosure:
# Tool: ChatGPT (model: GPT-5.6 Luna), date: 2026-09-30
# Scope: Reviewed and refined the Dockerfile for the API Gateway
# based on the finalized Phase 4 Dockerization requirements.
# Author review: Reviewed and validated against the finalized project design.

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json tsconfig*.json ./
RUN npm ci

COPY . .
RUN npm run build

RUN npm prune --production


# Stage 2: Runtime
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --chown=node:node --from=builder /app/package*.json ./
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist

USER node

EXPOSE 8080

CMD ["node", "dist/server.js"]