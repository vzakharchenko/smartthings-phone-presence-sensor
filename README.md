# smartthings router connection
## Description
    With this project you can use your router as a presence detector
    
  **Supported  SmartThings and SmartThing Classic applications**
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
3. open router Setting tab  ![](https://github.com/vzakharchenko/smartthings_asus_router/blob/master/img/routerSetting.png?raw=true)
4. select router type: asus or tplink
5. type ip of router
6. set login and password of router  web admin UI 
7. [install SmartApp Source](https://github.com/vzakharchenko/smartthings_asus_router#install-smartthink-app "install SmartApp Source")
8. [Add new device](https://github.com/vzakharchenko/smartthings_asus_router#add-new-device "Add new device")
9. [Add new SmartApp to SmartThings Classic](https://github.com/vzakharchenko/smartthings_asus_router#add-a-new-smartapp-to-smartthings-classic "Add a new SmartApp to SmartThings Classic")
10.  [Assign Phone Mac address to  SmartThing Device](https://github.com/vzakharchenko/smartthings_asus_router#assign-phone-mac-address-to--smartthing-device "Assign Phone Mac address to  SmartThing Device")
11. add more devices if necessary, for this repeat steps 7-10 to do this
12. now you can use Smartthings Device for automation)


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
2. open router Setting tab ![](https://github.com/vzakharchenko/smartthings_asus_router/blob/master/img/routerSetting.png?raw=true)
3. select router type: asus or tplink 
4. type ip of router
5. set login and password of router

## install SmartApp Source
1. open https://graph.api.smartthings.com/location/list with your samsung account
2. select your location ![](https://github.com/vzakharchenko/smartthings_asus_router/blob/master/img/Location.png?raw=true)
3. add new smartapp ![](https://github.com/vzakharchenko/smartthings_asus_router/blob/master/img/addNewSmartApp.png?raw=true)
4. select "From Code" insert code from https://raw.githubusercontent.com/vzakharchenko/smartthings_asus_router/master/smartapps/WiFi%20Mobile%20Presence.groovy ![](https://github.com/vzakharchenko/smartthings_asus_router/blob/master/img/createNewSmartApp.png?raw=true)
5. open App-Setting[https://github.com/vzakharchenko/smartthings_asus_router/blob/master/img/selectAppSetting.png?raw=true](https://github.com/vzakharchenko/smartthings_asus_router/blob/master/img/selectAppSetting.png?raw=true)
6. enable oauth in smartapp![](https://github.com/vzakharchenko/smartthings_asus_router/blob/master/img/enableOAuth.png?raw=true)
7.  save and publish![](https://github.com/vzakharchenko/smartthings_asus_router/blob/master/img/saveAndPublish.png?raw=true)

## Add new device
1. open https://graph.api.smartthings.com/location/list with your samsung account
2. select your location ![](https://github.com/vzakharchenko/smartthings_asus_router/blob/master/img/Location.png?raw=true)
3. goto "My Devices" -> "+ New Device"![](https://github.com/vzakharchenko/smartthings_asus_router/blob/master/img/addNewDevice.png?raw=true)
4. fill all required fields, **Type: "Simulated Presence Sensor" **![](https://github.com/vzakharchenko/smartthings_asus_router/blob/master/img/createPresenteSensor.png?raw=true)

## Add a new SmartApp to SmartThings Classic
1. install SmartThings Classic
2. open "Automation" Tab->"SmartApps" -> "add SmartApp"![](https://github.com/vzakharchenko/smartthings_asus_router/blob/master/img/addSmartApp.png?raw=true)
3. select "My app" category ![](https://github.com/vzakharchenko/smartthings_asus_router/blob/master/img/MyApps.png?raw=true)
4. add "WiFi Mobile Manager![](https://github.com/vzakharchenko/smartthings_asus_router/blob/master/img/addWifiMobilePresence.png?raw=true)
5. set Server IP, port, hub and Simulated Presence Sensor and click save ![](https://github.com/vzakharchenko/smartthings_asus_router/blob/master/img/settingSmartApp.png?raw=true)

## Assign Phone Mac address to  SmartThing Device
1. open link http:/<YOUR_SERVER_IP>:5000
2. goto Device Tab
3. assign network device to Smartthings Device![](https://github.com/vzakharchenko/smartthings_asus_router/blob/master/img/assignMac.png?raw=true)

## Remove Mac address from  SmartThings Device
1. open link http:/<YOUR_SERVER_IP>:5000
2. goto "SmartThing Devices" Tab
3. click "unAssign" ![](https://github.com/vzakharchenko/smartthings_asus_router/blob/master/img/unAssign.png?raw=true)



My env: [![CircleCI](https://circleci.com/gh/vzakharchenko/smartthings_asus_router.svg?style=svg)](https://circleci.com/gh/vzakharchenko/smartthings_asus_router)

