FROM keymetrics/pm2:latest-alpine

# Bundle APP files
RUN mkdir /opt/smartthings-phone-presence-sensor/
COPY lib /opt/smartthings-phone-presence-sensor/lib/
COPY package.json /opt/smartthings-phone-presence-sensor/package.json
COPY RouterSmartAppServer.js /opt/smartthings-phone-presence-sensor/RouterSmartAppServer.js
RUN echo '{"name":"smartthings-phone-presence-sensor","script":"/opt/smartthings-phone-presence-sensor/RouterSmartAppServer.js","instances":"1","env":{"NODE_ENV":"development"},"env_production":{"NODE_ENV":"production"}}' > pm2.json
RUN mkdir /opt/smartthings-phone-presence-sensor/router-ui
COPY router-ui/package.json /opt/smartthings-phone-presence-sensor/router-ui/package.json
COPY router-ui/src /opt/smartthings-phone-presence-sensor/router-ui/src
COPY router-ui/webpack.config.js /opt/smartthings-phone-presence-sensor/router-ui/webpack.config.js
RUN cd /opt/smartthings-phone-presence-sensor/router-ui/ && npm install
RUN cd /opt/smartthings-phone-presence-sensor/router-ui/ && npm run build:prod

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
RUN cd /opt/smartthings-phone-presence-sensor/ && npm install

CMD [ "pm2-runtime", "start", "pm2.json" ]
