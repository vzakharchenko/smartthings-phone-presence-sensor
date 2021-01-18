docker build -t smartthings-phone-presence-sensor .
docker tag  smartthings-phone-presence-sensor vassio/smartthings-phone-presence-sensor:1.0.9_arm
docker push vassio/smartthings-phone-presence-sensor:1.0.9_arm

docker tag  smartthings-phone-presence-sensor vassio/smartthings-phone-presence-sensor:latest_arm
docker push vassio/smartthings-phone-presence-sensor:latest_arm
