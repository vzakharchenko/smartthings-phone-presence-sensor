#!/bin/bash

pm2 start /opt/smartthings-phone-presence-sensor/RouterSmartAppServer.js
tail -f ~/.pm2/logs/RouterSmartAppServer-error.log
