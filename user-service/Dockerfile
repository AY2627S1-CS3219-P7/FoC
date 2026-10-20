# AI Assistance Disclosure:
# Tool: GitHub Copilot, date: 2026-10-20
# Scope: Remove User Service's Docker build dependency on the shared common module.
# Author review: Review pending.

FROM node:20-alpine
WORKDIR /app

COPY user-service/package*.json ./user-service/
RUN cd user-service && npm install

COPY user-service ./user-service

WORKDIR /app/user-service
EXPOSE 3002
CMD ["npm", "run", "dev"]