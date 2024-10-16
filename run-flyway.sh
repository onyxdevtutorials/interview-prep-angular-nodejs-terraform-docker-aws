#!/bin/bash

# Credentials and db url should be in .env.local or .env.production.
# Set NODE_ENV to "production" or "local" (or anything else as default is "local"):
# export NODE_ENV=production
# export NODE_ENV=local
# Then run this script:
# ./run-flyway.sh
# Load environment variables from the appropriate .env file
if [ "$NODE_ENV" == "production" ]; then
    export $(grep -v '^#' .env.production | xargs)
else
    export $(grep -v '^#' .env.local | xargs)
fi

# Run Flyway migrations
flyway -configFiles=flyway.conf migrate
