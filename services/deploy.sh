#! /bin/bash

npm install -g serverless
cd target/$env
npm install
cd services && serverless deploy --stage $env --package $CODEBUILD_SRC_DIR/target/$env -v -r eu-west-1
