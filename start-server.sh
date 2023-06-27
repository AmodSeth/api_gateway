#!/bin/bash

environment=$NODE_ENV
pm2_options=""

[[ $environment == "production" ]] || pm2_options="--no-daemon"

if [[ -z "$environment" ]]; then
    echo "Error: NODE_ENV environment variable is not set. Exiting the script."
    exit 1
fi

pm2 start pm2.config.js $pm2_options

pm2_exit_code=$?

if [[ $pm2_exit_code -eq 0 ]]; then
    if [[ $environment == "production" ]]; then
        tail -f /dev/null # keeps the Docker container running in production mode
    else
        tail -f -n 10 /logs/app.log
    fi
else
    echo "PM2 failed to start. Exiting the script."
fi
