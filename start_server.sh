#!/bin/bash
set -e

cd $( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

if test "package.json" -nt "node_modules"
then
    rm -rf node_modules
    npm install 
fi

kill `ps x | grep 'node server.js' | grep -v 'grep' | cut -c1-5 | xargs` || true
node RouterSmartAppServer.js
