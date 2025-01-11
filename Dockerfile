# Dockerfile for production-like deployments
# Stage 1: Build the Angular application
FROM node:20-bookworm AS build

WORKDIR /app/frontend

COPY frontend/package.json ./

RUN npm install

COPY frontend /app/frontend

RUN npm install -g @angular/cli

RUN npm run build:dev

# Stage 2: Prepare to serve the Angular application with Nginx
FROM nginx:alpine AS nginx

COPY --from=build /app/frontend/dist/interview-prep/browser /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80