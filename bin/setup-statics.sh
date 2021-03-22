#!/usr/bin/env bash

if [ -d "static" ]
then
    echo "moving files to static"
else
    echo "Error: missing static directory"
    exit 1
fi

for file in "$@"
do
  cp "$file" "static"
done