#! /bin/bash

npm install -g serverless
npm install
cd target/$env && serverless deploy --stage $env --package $CODEBUILD_SRC_DIR/target/$env -v -r eu-west-1
