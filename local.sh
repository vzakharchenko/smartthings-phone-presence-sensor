docker stop smartthings-phone-presence-sensor
docker rm smartthings-phone-presence-sensor

docker build -t smartthings-phone-presence-sensor .
docker run --name=smartthings-phone-presence-sensor  -p 5000:5000 smartthings-phone-presence-sensor
