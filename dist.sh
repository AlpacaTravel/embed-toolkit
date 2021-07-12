#!/bin/bash

REV=$(git rev-parse --short HEAD)
PACKAGE_VERSION=$(node -p -e "require('./package.json').version")

if [ -z "$(git status --untracked-files=no --porcelain)" ]; then
  echo "Deploying"
  aws s3 cp ./dist s3://cdn.alpacamaps.com/scripts/alpaca-toolkit/$PACKAGE_VERSION/$REV --recursive
  aws s3 cp ./docs s3://developer.alpacamaps.com --recursive
  touch ./dist/alpaca-toolkit@next.js
  aws s3 cp ./dist/alpaca-toolkit@next.js s3://cdn.alpacamaps.com/scripts/ --website-redirect /scripts/alpaca-toolkit/$PACKAGE_VERSION/$REV/alpaca-toolkit.js
  echo "Note: You will need to update the website redirects in cdn.alpacamaps.com to point to this release manually"
else
  echo "The current working directly has uncommited changes. Please commit before continuing"
fi
