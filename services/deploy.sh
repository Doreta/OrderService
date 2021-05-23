#! /bin/bash

npm install -g serverless
npm install --silent --no-progress
serverless deploy --stage $env --package $CODEBUILD_SRC_DIR/target/$env -v -r eu-west-1
