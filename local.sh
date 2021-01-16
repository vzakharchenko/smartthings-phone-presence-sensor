docker stop smartthings-phone-presence-sensor
docker rm smartthings-phone-presence-sensor
#docker image prune -a -f

docker build -t smartthings-phone-presence-sensor .
docker run --name=smartthings-phone-presence-sensor  -p 5000:5000 -v /home/vzakharchenko/home/smartthings-phone-presence-sensor/config:/opt/config smartthings-phone-presence-sensor
