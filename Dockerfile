FROM debian:stable
MAINTAINER Vasyl Zakharchenko <vaszakharchenko@gmail.com>
LABEL author="Vasyl Zakharchenko"
LABEL email="vaszakharchenko@gmail.com"
LABEL name="smartthings-phone-presence-sensor"
ENV DEBIAN_FRONTEND noninteractive
ENV NPM_CONFIG_LOGLEVEL warn
RUN apt-get update && apt-get install -y curl gnupg2 ca-certificates
RUN update-ca-certificates --fresh
RUN curl -sL https://deb.nodesource.com/setup_15.x | bash -
RUN apt-get update && apt-get install -y nodejs
RUN npm i pm2 -g
RUN npm i smartthings-phone-presence-sensor@1.1.3 -g
COPY entrypoint.sh /opt/entrypoint.sh
RUN  chmod +x /opt/entrypoint.sh
EXPOSE 5000
ENTRYPOINT ["/opt/entrypoint.sh"]
#CMD [ "pm2-runtime", "start", "pm2.json" ]
