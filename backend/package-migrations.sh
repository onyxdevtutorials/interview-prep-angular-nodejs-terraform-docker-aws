#!/bin/bash

cd "$(dirname "$0")"

cp -r migrations migrate-lambda/src/

cd migrate-lambda

rm -f migrate-package.zip

npm install

rm -rf dist

npm run build

# node ./rename-to-mjs.js
mv dist/index.js dist/index.mjs

cd dist
zip -r ../migrate-package.zip ./*
cd ..

zip -r migrate-package.zip node_modules/ package.json
