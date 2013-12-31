#!/usr/bin/env bash
dir=$(pwd)
cd /usr/local && curl http://nodejs.org/dist/v0.10.23/node-v0.10.23-linux-x64.tar.gz | tar -xzvf- --strip-components=1
cd "$dir"
npm install --production
