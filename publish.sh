#!/usr/bin/env bash -eo pipefail
EXTENSION_ID=gcgnjkmkkdllmfeeggghobokcnnfmjgg

token="$(npx chrome-webstore-manager refresh_token --client_id ${CLIENT_ID} --client_secret ${CLIENT_SECRET} --refresh_token ${REFRESH_TOKEN})"
export WEBSTORE_TOKEN="${token}"
npx chrome-webstore-manager update "${EXTENSION_ID}" ./output/github-bugspots-extension.zip
npx chrome-webstore-manager publish "${EXTENSION_ID}"
