#!/bin/sh

API="http://localhost:4741"
URL_PATH="/files"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request GET \
  --header "Authorization: Token token=${TOKEN}"

echo

#COMMAND LINE

# TOKEN="oWNcj/lbhPMQ3L/b8KnKnSujvKHXtAaLis1R3xcQXGI=--Y5sWVhdDxu6uNrmOrLCPeRbRu9+B/FxSb6lGcWQPjUk=" ID="5a84bcf17d1b718af686dd9f" sh scripts/files/show.sh
