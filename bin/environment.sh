#!/usr/bin/env bash
PULUMI_PATH="$1"
if [ "$PULUMI_PATH" = "" ]; then
  PULUMI_PATH=$PWD
fi

SCRIPT="bin/environment.js"
OUTPUT="$PULUMI_PATH/environment.$RANDOM.sh"

if [ -f "node_modules/decentraland-gatsby/bin/environment.js" ]; then
  SCRIPT="node_modules/decentraland-gatsby/bin/environment.js"
fi

node "$SCRIPT" "$PULUMI_PATH" "$OUTPUT"

if [ -f "$OUTPUT" ]; then
  chmod +x $OUTPUT
  source "$OUTPUT"
  # rm $OUTPUT
fi
