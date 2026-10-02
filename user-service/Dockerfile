FROM node:20-alpine
WORKDIR /app

COPY user-service/package*.json ./user-service/
RUN cd user-service && npm install

COPY common ./common
COPY user-service ./user-service

WORKDIR /app/user-service
EXPOSE 3002
CMD ["npm", "run", "dev"]