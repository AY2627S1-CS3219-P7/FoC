FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm i

COPY common ./common
COPY supplier-service ./supplier-service

WORKDIR /app/supplier-service
RUN npm i
CMD ["npm", "run", "dev"]