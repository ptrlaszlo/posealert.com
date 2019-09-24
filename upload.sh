#!/bin/sh

aws s3 sync generated/ s3://posealert.com --acl public-read --exclude "*" --include "*.html" --include "assets/*"