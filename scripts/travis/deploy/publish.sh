#!/bin/bash -e

DOMAIN="$1"
REPO_SLUG="$2"
USERNAME="$3"
PASSWORD="$4"
TAG_VERSION="$5"
BRANCH_NAME="$6"
DRY_RUN="$7"

npm ci && npm run build.release

echo "Running the docker with tag" $TAG_VERSION
DOCKER_PROJECT_ARGS="PROJECT_NAME=content-ce"
DOCKER_REPOSITORY="$DOMAIN/$REPO_SLUG"

# Publish Image to quay.io or dockerhub or another domain - only publish the version on master - elsewhere version and branch
if [[ "$BRANCH_NAME" == "master" ]]; then
  if [[ "$DRY_RUN" != "true" ]]; then
    npx @alfresco/adf-cli docker-publish --loginCheck --loginUsername "$USERNAME" --loginPassword "$PASSWORD" --loginRepo "$DOMAIN" --dockerRepo "$DOCKER_REPOSITORY" --buildArgs "$DOCKER_PROJECT_ARGS" --dockerTags "$TAG_VERSION" --pathProject "$(pwd)"
  fi;
else
  if [[ "$DRY_RUN" != "true" ]]; then
    npx @alfresco/adf-cli docker-publish --loginCheck --loginUsername "$USERNAME" --loginPassword "$PASSWORD" --loginRepo "$DOMAIN" --dockerRepo "$DOCKER_REPOSITORY" --buildArgs "$DOCKER_PROJECT_ARGS" --dockerTags "$TAG_VERSION,$BRANCH_NAME" --pathProject "$(pwd)"
  fi;
fi;
