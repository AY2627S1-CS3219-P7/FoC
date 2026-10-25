FROM node:20.18.0-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY app ./app

EXPOSE 3003

CMD ["npm", "run", "dev"]