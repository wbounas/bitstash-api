#!/bin/bash

API="http://localhost:4741"
URL_PATH="/files"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Token token=${TOKEN}" \
  --data '{
    "file": {
      "file_name": "'"${NAME}"'",
      "file_type": "'"${TYPE}"'",
      "file_size": "'"${SIZE}"'",
      "url": "'"${URL}"'",
      "tags": "'"${TAGS}"'",
      "_owner": "'"${ID}"'"
    }
  }'

echo
