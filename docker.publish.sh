docker build -t smartthings-phone-presence-sensor .
docker tag  smartthings-phone-presence-sensor vassio/smartthings-phone-presence-sensor:1.0.9
docker push vassio/smartthings-phone-presence-sensor:1.0.9

docker tag  smartthings-phone-presence-sensor vassio/smartthings-phone-presence-sensor:latest
docker push vassio/smartthings-phone-presence-sensor:latest
