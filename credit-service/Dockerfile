# AI Assistance Disclosure:
# Tool: GitHub Copilot, date: 2026-10-20
# Scope: Remove the obsolete common build dependency from Credit Service.
# Author review: Review pending.

FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm i

COPY credit-service ./credit-service

WORKDIR /app/credit-service
RUN npm i
CMD ["npm", "run", "dev"]