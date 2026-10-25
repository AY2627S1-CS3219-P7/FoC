FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm i

COPY app ./app

EXPOSE 3003

CMD ["npm", "run", "dev"]