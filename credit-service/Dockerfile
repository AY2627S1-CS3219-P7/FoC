FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm i

COPY common ./common
COPY credit-service ./credit-service

WORKDIR /app/credit-service
RUN npm i
CMD ["npm", "run", "dev"]