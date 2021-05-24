#! /bin/bash


mkdir -p .serverless
cp -r $CODEBUILD_SRC_DIR/target/$env/* $PWD/.serverless
serverless deploy --stage $env --package .serverless -v -r eu-west-1


