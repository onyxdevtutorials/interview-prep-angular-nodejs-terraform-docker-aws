FROM node:20

WORKDIR /app

COPY backend/package.json ./

RUN npm install

COPY backend /app/backend

WORKDIR /app/backend

EXPOSE 3000

CMD ["npm", "start"]
