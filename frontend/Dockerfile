FROM node:20-bookworm AS build

WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./

RUN rm -rf node_modules package-lock.json

RUN npm install

COPY frontend /app/frontend

RUN npm run build --prod

EXPOSE 4200

CMD ["npm", "start"]