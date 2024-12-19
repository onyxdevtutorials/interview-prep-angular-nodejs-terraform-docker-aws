#!/bin/bash

cd "$(dirname "$0")"

mkdir -p migrate-lambda/src

cp -r migrations migrate-lambda/src/
cp src/knexFile.ts migrate-lambda/src/

cd migrate-lambda

npm install

npm run build

zip -r migrate-package.zip dist/ node_modules/ package.json
