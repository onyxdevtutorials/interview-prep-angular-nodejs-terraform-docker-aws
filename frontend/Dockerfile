FROM node:20-bookworm AS build

WORKDIR /app/frontend

COPY frontend/package.json ./

RUN npm install

COPY frontend /app/frontend

RUN npm install -g @angular/cli

# Install Chromium for running tests
# RUN apt-get update && apt-get install -y chromium

# Set the CHROME_BIN environment variable
# ENV CHROME_BIN=/usr/bin/chromium

RUN npm run build --prod

EXPOSE 4200

CMD ["npm", "start"]