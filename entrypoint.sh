#!/bin/bash

pm2 start `npm root -g`/smartthings-phone-presence-sensor/RouterSmartAppServer.js
tail -f ~/.pm2/logs/RouterSmartAppServer-error.log
