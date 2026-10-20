# AI Assistance Disclosure:
# Tool: GitHub Copilot, date: 2026-10-20
# Scope: Remove the supplier image's common build dependency after moving auth locally.
# Author review: Review pending.

FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm i

COPY supplier-service ./supplier-service

WORKDIR /app/supplier-service
RUN npm i
CMD ["npm", "run", "dev"]