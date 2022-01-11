# smartthings router connection

![Docker](https://github.com/vzakharchenko/smartthings-phone-presence-sensor/workflows/ci/badge.svg)  
![Node.js CI](https://github.com/vzakharchenko/smartthings-phone-presence-sensor/workflows/Node.js%20CI/badge.svg)  
[![NPM](https://nodei.co/npm/smartthings-phone-presence-sensor.png)](https://npmjs.org/package/smartthings-phone-presence-sensor)  
[![donate](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://secure.wayforpay.com/button/b8390c46bf24a)  

## Description
    With this project you can use your router as a presence detector for your phones.
    Reads known personal mobile device's MAC address(using DHCP leases) to check each person's presence.
## Features
- work without Smartthings hub!
- [setup outside your network(Change presence status for Location where server is not installed)](https://github.com/vzakharchenko/smartthings-phone-presence-sensor#installation-outside-your-network)
- Presence sensor based on DHCP lease.
- can detect mobile phone in sleep state.
- support mikrotik, asus, tplink.
  **Supported  [SmartThings](https://play.google.com/store/apps/details?id=com.samsung.android.oneconnect)**  ~~and [SmartThings Classic](https://play.google.com/store/apps/details?id=com.smartthings.android) applications~~
## Supported device list:
- Asus:

    Firmware version should be later than 3.0.0.4.380:
    - All 802.11ax line up
    - All ROG Rapture line up
    - Blue Cave
    - BRT-AC828
    - RT-AC5300
    - RT-AC3100
    - RT-AC88U
    - RT-AC3200
    - RT-AC2900
    - RT-AC87U/R
    - RT-AC86U
    - RT-AC85U
    - RT-AC85P
    - RT-AC65P
    - RT-AC57U
    - RT-AC68U/R/P/W/UF
    - RT-AC65U
    - RT-AC1900
    - RT-AC1900P/U
    - RT-AC1750
    - RT-AC1750 B1
    - RT-AC66U/R/W
    - RT-AC66U B1
    - RT-AC66U+
    - RT-AC1300UHP
    - RT-AC1200
    - RT-AC1200G/HP/G+
    - RT-AC58U
    - RT-AC57U
    - RT-AC56U/R/S
    - RT-AC55U
    - RT-AC55UHP
    - RT-AC53U
    - RT-AC53
    - RT-AC52U
    - RT-AC52U B1
    - RT-AC51U
    - RT-AC51U+
    - RT-ACRH17
    - RT-ACRH13
    - RT-N66U/R/W
    - RT-N18U
    - RT-N16
    - RT-N14UHP
    - RT-N12E B1/C1
    - RT-N12HP B1
    - RT-N12VP B1
    - RT-N12+
    - RT-N12+ B1
    - RT-N12D1
    - DSL-AC68U/R
- TpLink:
    tested on TP-LINK Touch P5
- Mikrotik:
 - all devices

## Docker Installation
- prepare installation
```
sudo apt-get -y install  curl
sudo apt-get -y remove docker docker.io containerd runc
curl -sSL https://get.docker.com | sudo bash
sudo groupadd docker
sudo usermod -aG docker $USER
```
- Configuration inside Docker container
```
docker run -d --name=smartthings-phone-presence-sensor  -p 5000:5000 --restart=always vassio/smartthings-phone-presence-sensor:latest
```
- Configuration outside Docker container
```
mkdir -p /opt/config/router
echo "{}">/opt/config/router/routerConfig.json
docker run -d --name=smartthings-phone-presence-sensor  -p 5000:5000 -v /opt/config/router/routerConfig.json:/opt/config/routerConfig.json --restart=always vassio/smartthings-phone-presence-sensor:latest
```
- Configuration outside Docker container with keycloak.json
```
mkdir -p /opt/config/router
echo "{}">/opt/config/router/routerConfig.json
docker run -d --name=smartthings-phone-presence-sensor  -p 5000:5000 -v /opt/config/router/routerConfig.json:/opt/config/routerConfig.json -v /opt/config/router/keycloak.json:/opt/config/router/keycloak.json --restart=always vassio/smartthings-phone-presence-sensor:latest
```
## Installation Steps:
1. Install server
- using npm manager:
```bash
sudo npm i pm2 -g
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ${currentUser} --hp ${HOME}
sudo npm i smartthings-phone-presence-sensor -g
sudo pm2 start `npm root -g`/smartthings-phone-presence-sensor/RouterSmartAppServer.js
sudo pm2 save
```
- [Docker Installation](https://github.com/vzakharchenko/smartthings-phone-presence-sensor/blob/master/README.md#docker-installation)
- [Manual Server Installation Steps](https://github.com/vzakharchenko/smartthings-phone-presence-sensor/#manual-server-installation-steps)
2. open link http:/<YOUR_SERVER_IP>:5000
3. open router Setting tab  ![](https://github.com/vzakharchenko/smartthings-phone-presense-sensor/blob/master/img/routerSetting.png?raw=true)
4. select router type: asus or tplink or mikrotik
5. set ip(hostname) of router  web admin UI
6. set port of router  web admin UI (microtik rest API sevice). Default is 80 (microtik: 8728)
7. set login and password of router  web admin UI
8. [install SmartApp Source](https://github.com/vzakharchenko/smartthings-phone-presence-sensor/#install-smartapp-source)
9. [Create new device handler](https://github.com/vzakharchenko/smartthings-phone-presence-sensor/#install-device-handler)
10. [Add new SmartApp to SmartThings](https://github.com/vzakharchenko/smartthings-phone-presence-sensor#add-a-new-smartapp-to-smartthings)
11.  [Assign Phone Mac address to  SmartThing Device](https://github.com/vzakharchenko/smartthings-phone-presence-sensor#assign-phone-mac-address-to--smartthing-device)
12. add more devices if necessary, for this repeat steps 7-10 to do this
13. now you can use Smartthings Device for automation


## Installation Outside your network:

Change presence status for Location where server is not accessible.
Example:
 - Location 1 has server
 - Location 2 does not have server
 I would like to change my presence status to Leave for location 2 if my phone is in location 1.
 
1. Install server
- using npm manager:
```bash
sudo wget -qO- https://getpm2.com/install.sh | bash
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ${currentUser} --hp ${HOME}
sudo npm i smartthings-phone-presence-sensor -g
sudo pm2 start `npm root -g`/smartthings-phone-presence-sensor/RouterSmartAppServer.js
sudo pm2 save
```
- [Docker Installation](https://github.com/vzakharchenko/smartthings-phone-presence-sensor/blob/master/README.md#docker-installation)
- [Manual Server Installation Steps](https://github.com/vzakharchenko/smartthings-phone-presence-sensor/#manual-server-installation-steps)
2. open link http:/<YOUR_SERVER_IP>:5000
3. open router Setting tab  ![](https://github.com/vzakharchenko/smartthings-phone-presense-sensor/blob/master/img/routerSetting.png?raw=true)
4. select router type: asus or tplink or mikrotik
5. set ip(hostname) of router  web admin UI
6. set port of router  web admin UI (microtik rest API sevice). Default is 80 (microtik: 8728)
7. set login and password of router  web admin UI
8. [install SmartApp Source](https://github.com/vzakharchenko/smartthings-phone-presence-sensor/#install-smartapp-source)
9. [Create new device handler](https://github.com/vzakharchenko/smartthings-phone-presense-sensor/#install-device-handler)
10. [Add new SmartApp to SmartThings with device name](https://github.com/vzakharchenko/smartthings-phone-presence-sensor#add-a-new-smartapp-to-smartthings-outside-network)
11.  [Assign Phone Mac address to  SmartThing Device](https://github.com/vzakharchenko/smartthings-phone-presense-sensor#assign-phone-mac-address-to--smartthing-device)
12. add more devices if necessary, for this repeat steps 7-10 to do this
13. now you can use Smartthings Device for automation

## Manual Server Installation Steps:
1. setup linux on RaspberryPi https://ubuntu.com/download/iot/raspberry-pi-2-3
2. install node.
```bash
sudo apt-get install curl
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install nodejs
```
or
```bash
sudo apt-get install snapd
sudo snap install node --channel=14/stable --classic
```
3. install git
`sudo apt-get install git`
4. install pm2
`sudo npm i pm2 -g`
5. add pm2 to autostart
```bash
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ${currentUser} --hp ${HOME}
```
6. make directory /opt/app
```bash
 sudo mkdir -p /opt/app
```
7. make directory /opt/config
8. change ownership of /opt/app and /opt/config
```bash
 sudo chown -R <USER>:<USER> /opt/app
sudo chown -R <USER>:<USER> /opt/config
```
9. checkout project
```bash
 cd /opt/app
 git clone https://github.com/vzakharchenko/https://github.com/vzakharchenko/smartthings-phone-presense-sensor router
```
10.  copy config `cp -n /opt/app/router/config/config.json /opt/config/routerConfig.json`
11.  install and build project
```bash
cd /opt/app/router
npm i
cd router-ui
npm i
npm build
cd ..
```
12. add poject to pm2
```bash
cd /opt/app/router
pm2 start RouterSmartAppServer.js
pm2 save
```

## Router setting
1. open link http:/<YOUR_SERVER_IP>:5000
2. open router Setting tab ![](https://github.com/vzakharchenko/smartthings-phone-presense-sensor/blob/master/img/routerSetting.png?raw=true)
3. select router type: asus or tplink or mikrotik
4. set ip(hostname) of router  web admin UI
5. set port of router  web admin UI (microtik rest API sevice). Default is 80 (microtik: 8728)
6. set login and password of router

## install SmartApp Source
1. open https://graph.api.smartthings.com/location/list with your samsung account
2. select your location ![](https://github.com/vzakharchenko/smartthings-phone-presense-sensor/blob/master/img/Location.png?raw=true)
3. add new smartapp ![](https://github.com/vzakharchenko/smartthings-phone-presense-sensor/blob/master/img/addNewSmartApp.png?raw=true)
4. select "From Code" insert code from https://github.com/vzakharchenko/smartthings-phone-presence-sensor/blob/master/smartapps/WiFi%20%20Presence.groovy ![](https://github.com/vzakharchenko/smartthings-phone-presense-sensor/blob/master/img/createNewSmartApp.png?raw=true)
5. open App-Setting ![](https://github.com/vzakharchenko/smartthings-phone-presense-sensor/blob/master/img/selectAppSetting.png?raw=true)
6. enable oauth in smartapp![](https://github.com/vzakharchenko/smartthings-phone-presense-sensor/blob/master/img/enableOAuth.png?raw=true)
7.  save and publish![](https://github.com/vzakharchenko/smartthings-phone-presense-sensor/blob/master/img/saveAndPublish.png?raw=true)

## install device Handler
1. open https://graph.api.smartthings.com/location/list with your samsung account
2. select your location ![](https://github.com/vzakharchenko/smartthings-phone-presense-sensor/blob/master/img/Location.png?raw=true)
3. goto "My Device Handlers" -> "Create New Device Handler"![](https://github.com/vzakharchenko/smartthings-phone-presense-sensor/blob/master/img/newDeviceHandler.png?raw=true)
4. select "From Code" insert code from https://github.com/vzakharchenko/smartthings-phone-presence-sensor/blob/master/smartapps/WiFi%20%20Presence.groovy ![](https://github.com/vzakharchenko/smartthings-phone-presense-sensor/blob/master/img/newDeviceHandler2.png?raw=true)

## Add a new SmartApp to [SmartThings](https://play.google.com/store/apps/details?id=com.samsung.android.oneconnect&hl=en&gl=US)

1. install [SmartThings](https://play.google.com/store/apps/details?id=com.samsung.android.oneconnect&hl=en&gl=US)
2. open "+"->"SmartApps"![](./img/smartthingsStep1.png?raw=true) ![](./img/smartthingsStep2.png)
4. add "WiFi Device Presence"![](./img/smartthingsStep3.png)
5. set Server IP, port and Presence Sensor Name and click save ![](./img/smartthingsStep4.png)

## Add a new SmartApp to [SmartThings](https://play.google.com/store/apps/details?id=com.samsung.android.oneconnect&hl=en&gl=US) Outside network
Change presence status for Location where server is not accessible.
Example:
 - Location 1 has server
 - Location 2 does not have server
 I would like to change my presence status to Leave for location 2 if my phone is in location 1.

1. install [SmartThings](https://play.google.com/store/apps/details?id=com.samsung.android.oneconnect&hl=en&gl=US)
2. open "+"->"SmartApps"![](./img/smartthingsStep1.png?raw=true) ![](./img/smartthingsStep2.png)
4. add "WiFi Device Presence"![](./img/smartthingsStep3.png)
5. set Presence Sensor Name and click save ![](./img/smartthingsStep6.png)
6. Manually add Integration between SmartApp and nodejs server

## Assign Phone Mac address to  SmartThing Device
1. open link http:/<YOUR_SERVER_IP>:5000
2. goto Device Tab
3. assign network device to Smartthings Device ![](https://github.com/vzakharchenko/smartthings-phone-presense-sensor/blob/master/img/assignMac.png?raw=true)

## Remove Mac address from  SmartThings Device
1. open link http:/<YOUR_SERVER_IP>:5000
2. goto "SmartThing Devices" Tab
3. click "unAssign" ![](https://github.com/vzakharchenko/smartthings-phone-presense-sensor/blob/master/img/unAssign.png?raw=true)

## Manually add Integration between SmartApp and nodejs server

1. get  applicationId and secret from SmartApp
    - open smartapp on phone: ![](../img/smartthingsStep5.png)
    or
    - open smartapp on [smartthing portal](https://graph.api.smartthings.com):   ![](https://github.com/vzakharchenko/smartthings-phone-presense-sensor/blob/master/img/installedSmartapps.png?raw=true)   ![](https://github.com/vzakharchenko/smartthings-phone-presense-sensor/blob/master/img/selectsSmartApp.png?raw=true)   ![](https://github.com/vzakharchenko/smartthings-phone-presense-sensor/blob/master/img/AppIdSecretWeb.png?raw=true)
2. open link http:/<YOUR_SERVER_IP>:5000
3. goto "SmartThing Devices" Tab
4. set applicationId and secret from step 1, and click "add Device" ![](https://github.com/vzakharchenko/smartthings-phone-presense-sensor/blob/master/img/ManuallyAddDevice.png?raw=true)

## Protect Admin UI using [keycloak SSO](https://www.keycloak.org/) (Optional)
1. download keycloak.json from the keycloak admin ui [https://www.keycloak.org/docs/latest/securing_apps/](https://www.keycloak.org/docs/latest/securing_apps/).
2. save keycloak.json to /opt/config/router/keycloak.json or [./config/keycloak.json](/config)

example of keycloak.json
```json
{
  "realm": "REALM",
  "auth-server-url": "https://localhost:8090/auth",
  "ssl-required": "external",
  "resource": "testClient",
  "credentials": {
    "secret": "secret"
  },
  "confidential-port": 0
}
```

# If you find these useful, please [Donate](https://secure.wayforpay.com/button/b8390c46bf24a)!
