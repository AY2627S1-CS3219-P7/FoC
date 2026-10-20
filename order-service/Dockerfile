FROM node:20-alpine

ENV NODE_ENV=production
WORKDIR /app

# Copy manifests first so the dependency layer is cached until they change
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --chown=node:node . .

# Don't run as root inside the container
USER node

EXPOSE 3003
CMD ["node", "server.js"]
