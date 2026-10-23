FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm i

COPY common ./common
COPY order-service ./order-service

WORKDIR /app/order-service

RUN npm ci --omit=dev

ENV NODE_ENV=production

USER node

EXPOSE 3003

CMD ["npm", "start"]
