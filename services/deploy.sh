#! /bin/bash
pwd
npm install -g serverless
cd target/$env && npm install
cd ../..
ls
serverless deploy --stage $env --package target/$env -v -r eu-west-1
