FROM node:20.18.0-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY src ./src

EXPOSE 3002

CMD ["npm", "run", "dev"]