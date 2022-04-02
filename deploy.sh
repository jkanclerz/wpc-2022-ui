#!/bin/bash

npx webpack build --mode=development
aws s3 sync ./dist/ s3://${BUCKET_NAME}/ --acl=public-read