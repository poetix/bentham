#!/bin/bash
set -e
BRANCH=${TRAVIS_BRANCH:-$(git rev-parse --abbrev-ref HEAD)} 
PR=${TRAVIS_PULL_REQUEST:-false}


# Maps branch to stage
if [[ $BRANCH == 'master' ]]; then
  STAGE="test"
fi
echo "Branch: $BRANCH, Mapped Stage: $STAGE, Is a PR? ${TRAVIS_PULL_REQUEST}"

# Only deploy branches with stages, but not PR
if [ -z "$STAGE" ] || [ ! "$PR" = false ]; then
  echo "Not deploying this branch";
  exit 0;
fi

echo "Deploying from branch $BRANCH to stage $STAGE"

export ICARUS_STAGE=$STAGE

# Deploy backend
sls deploy -v

# Compile frontend
cd client
npm run build

# Deploy frontend
cd ..
sls client deploy  -v 