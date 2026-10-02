# AI Assistance Disclosure:
# Tool: ChatGPT (model: GPT-5.6 Luna), date: 2026-09-30
# Scope: Reviewed and refined the Dockerfile for the API Gateway
# based on the finalized Phase 4 Dockerization requirements.
# Author review: Reviewed and validated against the finalized project design.

# AI Assistance Disclosure:
# Tool: ChatGPT (model: GPT-5.6 Luna), date: 2026-10-02
# Scope: Adjusted the Gateway Docker build context to include the shared
# monorepo common module so TypeScript can resolve the unified auth contract
# during containerized build steps.
# Author review: Reviewed and validated against the monorepo layout and the
# Gateway Docker build dependency on the shared common package.

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY gateway/package*.json gateway/tsconfig*.json ./gateway/
COPY common ./common
RUN cd gateway && npm ci

COPY gateway ./gateway
RUN cd gateway && npm run build

RUN cd gateway && npm prune --production


# Stage 2: Runtime
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --chown=node:node --from=builder /app/gateway/package*.json ./
COPY --chown=node:node --from=builder /app/gateway/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/gateway/dist ./dist

USER node

EXPOSE 8080

CMD ["node", "dist/gateway/src/server.js"]