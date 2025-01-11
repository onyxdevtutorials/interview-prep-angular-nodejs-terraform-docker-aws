# Stage 1: Build the Node.js application
FROM node:20 AS build

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Prepare to serve the application
FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/dist /app/dist
COPY --from=build /app/package.json /app/package.json

# Exclude devDependencies
RUN npm install --only=production

ENV DEBUG=* NPM_CONFIG_LOGLEVEL=verbose

EXPOSE 3000

CMD ["npm", "start"]
