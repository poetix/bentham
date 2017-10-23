#!/bin/bash
set -e
BRANCH=${TRAVIS_BRANCH:-$(git rev-parse --abbrev-ref HEAD)} 

# Maps branch to stage
if [[ $BRANCH == 'master' ]]; then
  STAGE="test"
  TABLEDELETION="Retain"
fi

echo "Branch: $BRANCH, PR? ${TRAVIS_PULL_REQUEST}, Stage: $STAGE"

# Do not deploy PR
if [[  "${TRAVIS_PULL_REQUEST}" = true ]]; then
  echo "Not deploying PR"
  exit 0
fi

# Only deploy branches with stages
if [ -z "$STAGE" ]; then
  echo "Not deploying this branch";
  exit 0;
fi

echo "Deploying from branch $BRANCH to stage $STAGE"
#npm prune --production  #remove devDependencies

# Deploy backend
sls deploy --stage $STAGE --tableDeletion $TABLEDELETION -v

# Deploy frontend
sls client deploy --stage $STAGE -v 