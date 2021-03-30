#!/usr/bin/env bash

if [ -d "static" ]
then
    echo "moving files to static"
else
    echo "Error: missing static directory"
    exit 1
fi

echo "" > "static/global.css"
for file in "$@"
do
  echo "/** $file */" >> ""
  cat "$file" >> "static/global.css"
done