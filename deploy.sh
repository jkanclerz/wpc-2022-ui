#!/bin/bash

npx webpack build --mode=development
aws s3 sync ./dist/ s3://${MY_BUCKET}/ --acl=public-read