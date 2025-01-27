# Stage 1: Build the Node.js application
FROM node:20 AS build

WORKDIR /app/backend

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Prepare to serve the application
FROM node:20-alpine

WORKDIR /app/backend

COPY --from=build /app/backend/dist /app/backend/dist
COPY --from=build /app/backend/package.json /app/backend/package.json
COPY --from=build /app/backend/src /app/backend/src
COPY --from=build /app/backend/jest.config.ts /app/backend/jest.config.ts
COPY --from=build /app/backend/tsconfig.json /app/backend/tsconfig.json
COPY --from=build /app/backend/migrations /app/backend/migrations
COPY --from=build /app/backend/seeds /app/backend/seeds
RUN npm install

# ENV DEBUG=* NPM_CONFIG_LOGLEVEL=error

EXPOSE 3000

CMD ["npm", "start"]
