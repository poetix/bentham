#!/bin/bash
set -e
BRANCH=${TRAVIS_BRANCH:-$(git rev-parse --abbrev-ref HEAD)} 

# Only deploy 'master'
if [[ $BRANCH == 'master' ]]; then
  STAGE="test"
  TABLEDELETION="Retain"
fi

if [ -z ${STAGE+x} ]; then
  echo "Not deploying changes";
  exit 0;
fi

echo "Deploying from branch $BRANCH to stage $STAGE"
#npm prune --production  #remove devDependencies

# Deploy backend
sls deploy --stage $STAGE --tableDeletion $TABLEDELETION -v

# Deploy frontend
sls client deploy --stage $STAGE -v 