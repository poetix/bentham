#!/bin/bash
set -e
BRANCH=${TRAVIS_BRANCH:-$(git rev-parse --abbrev-ref HEAD)} 
PR=${TRAVIS_PULL_REQUEST:-false}

# Maps branch to stage
if [[ $BRANCH == 'master' ]]; then
  STAGE="test"
  TABLEDELETION="Retain"
fi

echo "Branch: $BRANCH, Mapped Stage: $STAGE, PR? ${TRAVIS_PULL_REQUEST}"


# Only deploy branches with stages, but not PR
if [ -z "$STAGE" ] || [ ! "$PR" = false ]; then
  echo "Not deploying this branch";
  exit 0;
fi

echo "Deploying from branch $BRANCH to stage $STAGE"
#npm prune --production  #remove devDependencies

# Deploy backend
sls deploy --stage $STAGE --tableDeletion $TABLEDELETION -v

# Deploy frontend
sls client deploy --stage $STAGE -v 