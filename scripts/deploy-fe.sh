#!/bin/bash
if [ -z "$ICARUS_STAGE" ]; then
  exit 0;
fi

echo "Deploying front end to stage $ICARUS_STAGE"

sls client deploy -v