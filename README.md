# smartthings router connection
## Description
    With this project you can use your router as a presence detector
    
  **Supported new SmartThings and SmartThing Classic applications**
## Supported device list:
Asus:

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
TpLink:

    tested on TP-LINK Touch P5

## Installation Steps:
1. Install server
`curl -sSL https://raw.githubusercontent.com/vzakharchenko/smartthings_asus_router/master/install.sh | bash`
2. open link http:/<YOUR_SERVER_IP>:5000
3. open router Setting tab
4. select router type: asus or tplink
5. type ip of router
6. set login and password of router  web admin UI
7. install SmartThink app
8. Add a new SmartApp to SmartThings Classic
9.  Assign Phone Mac address to  SmartThing Device
10. now you can use Smartthings Device for automation)


##Manual Server Installation Steps:
1. setup linux on RaspberryPi https://ubuntu.com/download/iot/raspberry-pi-2-3
2. install node.
`sudo apt-get install curl
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -`
`sudo apt-get install nodejs`
3. install git
`sudo apt-get install git`
4. install pm2
`sudo npm i pm2 -g`
5. add pm2 to autostart
`sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ${currentUser} --hp ${HOME}`
6. make directory /opt/app
`sudo mkdir -p /opt/app`
7. make directory /opt/config
8. change ownership of /opt/app and /opt/config
`sudo chown -R <USER>:<USER> /opt/app`
`sudo chown -R <USER>:<USER> /opt/config`
9. checkout project
`cd /opt/app`
`git clone https://github.com/vzakharchenko/smartthings_asus_router router`
10.  copy config `cp -n /opt/app/router/config/config.json /opt/config/routerConfig.json`
11.  install and build project
`cd /opt/app/router`
`npm i`
`cd router-ui`
`npm i`
`npm build`
`cd ..`
12. add poject to pm2
`cd /opt/app/router`
`pm2 start AsusSmartAppServer.js`
`pm2 save`
 
## Router setting
1. open link http:/<YOUR_SERVER_IP>:5000
2. open router Setting tab <routerSetting.png>
3. select router type: asus or tplink 
4. type ip of router
5. set login and password of router

## install SmartThink app
1. open https://graph.api.smartthings.com/location/list with your samsung account
2. select your location <location.png>
3. add new smartapp <addNewSmartApp.png>
4. select "From Code" insert code from https://raw.githubusercontent.com/vzakharchenko/smartthings_asus_router/master/smartapps/WiFi%20Mobile%20Presence.groovy <createNewSmartApp.png>
5. open App-Setting  <selectAppSetting.png>
6. enable oauth in smartapp <enableOAuth.png>
7.  save and publish <saveAndPublish.png>

## Add new device
1. open https://graph.api.smartthings.com/location/list with your samsung account
2. select your location <location.png>
3. goto "My Devices" -> "+ New Device" <addNewDevice.png>
4. fill all required fields, **Type: "Simulated Presence Sensor" **<createPresenteSensor.png>

## Add a new SmartApp to SmartThings Classic
1. install SmartThink app
2.  Add new device 
3. install SmartThings Classic
4. open "Automation" Tab->"SmartApps" -> "add SmartApp" <addSmartApp.png>
5. select "My app" category <MyApps.png>
6. add "WiFi Mobile Manager <addWifiMobilePresence.png>
7. set Server IP, port, hub and Simulated Presence Sensor <settingSmartApp.png> and click save

## Assign Phone Mac address to  SmartThing Device
1. Add a new SmartApp to SmartThings Classic
2. open link http:/<YOUR_SERVER_IP>:5000
3. goto Device Tab
4. assign network device to Smartthings Device <assignMac.png>

## Remove Mac address from  SmartThings Device
1. open link http:/<YOUR_SERVER_IP>:5000
2. goto "SmartThing Devices" Tab
3. click "unAssign" <unAssign.png>



My env: [![CircleCI](https://circleci.com/gh/vzakharchenko/smartthings_asus_router.svg?style=svg)](https://circleci.com/gh/vzakharchenko/smartthings_asus_router)

