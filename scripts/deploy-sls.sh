#!/bin/bash
if [ -z "$ICARUS_STAGE" ]; then
  echo "Skip deploying"
  exit 0;
fi

echo "Deploying serverless to stage $ICARUS_STAGE"
sls deploy -v