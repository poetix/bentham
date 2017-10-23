#!/bin/bash
set -e
BRANCH=$(git rev-parse --abbrev-ref HEAD) 

# Only deploy 'master'
if [[ $BRANCH == 'master' ]]; then
  STAGE="test"
  TABLEDELETION="Retain"
fi
echo "Branch: $BRANCH, Stage: $STAGE"

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