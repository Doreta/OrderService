#! /bin/bash

npm install -g serverless
cd services
cd target/$env
npm install
serverless deploy --stage $env --package $CODEBUILD_SRC_DIR/target/$env -v -r eu-west-1
