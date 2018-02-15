#!/bin/bash

API="http://localhost:4741"
URL_PATH="/files"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
  --header "Authorization: Token token=${TOKEN}" \
  --data '{
    "file": {
      "file_name": "'"${NAME}"'",
      "file_type": "'"${TYPE}"'",
      "file_size": "'"${SIZE}"'",
      "url": "'"${URL}"'",
      "tags": "'"${TAGS}"'",
      "_owner": "'"${OWNERID}"'"
    }
  }'

echo

# COMMAND LINE
# TOKEN="oWNcj/lbhPMQ3L/b8KnKnSujvKHXtAaLis1R3xcQXGI=--Y5sWVhdDxu6uNrmOrLCPeRbRu9+B/FxSb6lGcWQPjUk=" ID="5a84bcf17d1b718af686dd9f" NAME="FISH" URL="bubble.com" TAGS=".txt" SIZE=4000 TYPE="txt" OWNERID="5a8450ab4c8a615721f06182" sh scripts/files/update.sh
