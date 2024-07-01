#!/bin/bash

# Check if NODE_ENV is set
if [ -z "$NODE_ENV" ]; then
  echo "NODE_ENV is not set. Please set NODE_ENV to either 'development' or 'production'."
  exit 1
fi

# Check if NODE_ENV is 'development' or 'production'
if [ "$NODE_ENV" = "development" ]; then
  echo ">>>> Running in development mode..."
  yarn run dev
elif [ "$NODE_ENV" = "production" ]; then
  echo ">>>> Running in production mode..."
  yarn start
else
  echo "Invalid NODE_ENV value. Please set NODE_ENV to either 'development' or 'production'."
  exit 1
fi
