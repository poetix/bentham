#!/bin/bash
set -e
BRANCH=${TRAVIS_BRANCH:-$(git rev-parse --abbrev-ref HEAD)} 
PR=${TRAVIS_PULL_REQUEST:-false}
DBDELETIONPOLICY=${DB_DELETION:-Retain} # Allows overriding del

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
sls deploy --stage $STAGE --dbDeletion $DBDELETIONPOLICY -v

# Deploy frontend
# FIXME Compile frontend
sls client deploy --stage $STAGE -v 