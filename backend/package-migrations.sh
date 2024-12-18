#!/bin/bash

cd "$(dirname "$0")"

# Relying on install already being run in a previous step of the workflow.

zip -r migrate-package.zip src/knexFile.ts migrate.ts migrations/ node_modules/ package.json
