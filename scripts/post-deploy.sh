#!/bin/bash
if [ -z "$ICARUS_STAGE" ]; then
  echo "Skipping end-to-end tests as code is not deployed";
  exit 0;
fi

cd client
yarn e2e