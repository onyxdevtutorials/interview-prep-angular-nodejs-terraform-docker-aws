# Stage 1: Build the Node.js application
FROM node:20 AS build

WORKDIR /app

COPY backend/package.json ./

RUN npm install

COPY backend /app/backend

WORKDIR /app/backend

RUN npm run build

# Stage 2: Prepare to serve the application
FROM node:20-alpine

WORKDIR /app/backend

COPY --from=build /app/backend/dist /app/backend/dist
COPY --from=build /app/backend/package.json /app/backend/package.json

RUN npm install --only=production

ENV DEBUG=* NPM_CONFIG_LOGLEVEL=verbose

EXPOSE 3000

CMD ["npm", "start"]
