definition(
        name: "AsusWRT Wifi Manager",
        namespace: "smartthings-users",
        author: "Vasiliy Zakharchenko",
        description: "Create/Delete guest Wifi",
        category: "My Apps",
        iconUrl: "https://www.asus.com/media/ua/ProductLevel1/Topmenu/617.png",
        iconX2Url: "https://www.asus.com/media/ua/ProductLevel1/Topmenu/617.png")

preferences {
    page(name: "config")
}

def config() {
    dynamicPage(name: "config", title: "AssusWRT Router Manager", install: true, uninstall: true) {


        section("Setup my device with this IP") {
            input "IP", "string", multiple: false, required: true
        }
        section("Setup my device first port") {
            input "port", "number", multiple: false, required: true, defaultValue: 5000
        }
        section("on this hub...") {
            input "theHub", "hub", multiple: false, required: true
        }

        if (IP && port && theHub) {

            if (!state.backendInitialized) {
                section("Info") {
                    if (!app.id) {
                        paragraph "After click save, please, open this smartapp once again!"
                    } else if (!state.accessToken) {
                        paragraph "Did you forget to enable OAuth in SmartApp IDE settings?"
                    } else {
                        paragraph "Please set \"appId\": ${app.id}, \"accessToken\": ${state.accessToken} on backend($IP:$port)"
                    }
                }
            } else {
                if (state.usersDevices != null) {
                    section("User List") {
                        def userOptions = state.usersDevices.collect { s ->
                            s.user
                        }
                        debug("userList:$userOptions")
                        input "userList", "enum", multiple: true, required: false, title: "Select Users (${userOptions.size()} found)", options: userOptions
                    }
                }
                if (state.wifiDevices != null) {
                    section("Guest WiFi List") {
                        def guestOptions = state.wifiDevices.collect { s ->
                            s.name
                        }
                        debug("WiFIList:$guestOptions")
                        input "wiFiDeviceList", "enum", multiple: true, required: false, title: "Select Guest WiFi Sockets (${guestOptions.size()} found)", options: guestOptions
                    }
                }
            }
        }
    }
}

def installed() {
    createAccessToken()
    getToken()
    initialize()
//	debug("Installed Phone with rest api: $app.id")
    // debug("Installed Phone with token: $state.accessToken")
}

def updated() {
    initialize()
}

mappings {
    path("/Router/init") {
        action:
        [
                POST: "routerInitialization"
        ]
    }
    path("/Phone/status") {
        action:
        [
                POST: "responsePresent"
        ]
    }
    path("/WIFI/guests") {
        action:
        [
                POST: "updateWiFiGuests"
        ]
    }
}

def initialize() {
    unsubscribe();
    if (userList) {
        userList.each {
            def userName = it;
            debug("userName=$userName")

            createMobileWifiPresence(userName);
        }
    }

    if (wiFiDeviceList) {
        wiFiDeviceList.each {
            def wifiName = it;
            createGuestWifi(wifiName)
        }
    }


}


def routerInitialization() {
    def json = request.JSON;
    debug("json: $json")
    debug("json.users = ${json.users}")
    debug("json.guestWiFi = ${json.guestWiFi}")
    def usersDevices = filterUsersDevices(json.users, true);
    def wifiDevices = json.guestWiFi;
    state.wifiDevices = wifiDevices;
    debug("usersDevices =${usersDevices}");
    debug("wifiDevices =${wifiDevices}");
    state.backendInitialized = true;
    apiGet('/getAllNetwork', [])
    return [status: "ok"]
}

def filterUsersDevices(usersDevices, updateMac) {
    def filteredUsersDevices = []
    usersDevices.each {
        def user = it.user
        def mac = it.mac
        def sort = mac.collect().toSorted();
        def macString = sort.join(",")
        def dev = searchDeviceStateAndType("Mobile WIFI Presence", "user", user);
        if (dev != null) {
            if (updateMac) {
                dev.sendEvent(name: "mac", value: macString)
            }
            // } else {
            filteredUsersDevices.add(it);
        }

    }
    state.usersDevices = usersDevices;
    return filteredUsersDevices;
}

def filteredWifiDevices(wifiDevices) {
    def filteredWifiDevices = []
    wifiDevices.each {
        def name = it.name
        def id = it.id

        def dev = searchDeviceStateAndType("Asus Guest Network", "guestWiFiId", id);
        if (dev == null) {
            filteredWifiDevices.add(it);
        }
    }
    debug("filteredWifiDevices = $filteredWifiDevices");
    state.wifiDevices = filteredWifiDevices;
    return filteredWifiDevices;
}

def responsePresent() {
    def json = request.JSON
    debug("json: $json")
    def maclist = json.maclist;
    childDevices.each {
        if (it.getTypeName() == "Mobile WIFI Presence") {
            def macs = it.currentState("mac").getStringValue() != null ? it.currentState("mac").getStringValue().split(",") : "";
            if (macs != null) {
                def mac = searchMac(maclist, macs)
                if (mac != null) {
                    it.sendEvent(name: "presence", value: 'presence');
                } else {
                    it.sendEvent(name: "presence", value: 'no presence');
                }
                def blocked = searchMac(json.blockedMacs, macs)
                debug("blocked: $blocked")
                if (blocked != null) {
                    it.sendEvent(name: "switch", value: 'off');
                } else {
                    it.sendEvent(name: "switch", value: 'on');
                }
            } else {
                it.sendEvent(name: "presence", value: 'no presence');
            }
        }
    }
    return ["status": "ok"]
}

def searchMac(maclist, macs) {
    return maclist.find { it in macs }
}

def updateWiFiGuests() {
    def json = request.JSON
    log.debug "request: $request"
    log.debug "updateWiFiGuests json: $json"
    json.each { key, value ->
        def device = searchDevicesType("Asus Guest Network").find { it.getDeviceNetworkId() == key };
        if (device != null) {
            def status = value.status;
            if (status == "Exists") {
                def startDate = device.currentState("startDate").getValue() == null ? null : device.currentState("startDate").getDateValue();
                if (device.currentState('switch').getStringValue() == "on" && startDate == null) {
                    device.sendEvent(name: "startDate", value: new Date());
                }
                def wpa_psk_type = device.getPreferenceValue("wpa_psk_type");

                if (wpa_psk_type == "OneDayPassword" || wpa_psk_type == "OneWeekPassword") {
                    Calendar c1 = Calendar.getInstance();
                    c1.setTime(startDate);
                    if (wpa_psk_type == "OneDayPassword") {
                        c1.add(Calendar.DAY_OF_MONTH, 1)
                    } else if (wpa_psk_type == "OneWeekPassword") {
                        c1.add(Calendar.DAY_OF_MONTH, 7)
                    }
                    def endDate = new Date(c1.getTimeInMillis());

                    if (new Date().getTimeInMillis() >= c1.getTimeInMillis()) {
                        device.sendEvent(name: "switch", value: 'off');
                        device.sendEvent(name: "startDate", value: null);
                        evt.getDevice().currentState();
                    } else {
                        device.sendEvent(name: "switch", value: 'on');
                    }
                } else {
                    if (device.currentState('switch').getStringValue() == "off") {
                        device.sendEvent(name: "startDate", value: new Date());
                    }
                    device.sendEvent(name: "switch", value: 'on');

                }
            } else {
                device.sendEvent(name: "switch", value: 'off');
                device.sendEvent(name: "startDate", value: null);
            }
            def guestNetwork = value.guestNetwork;
            device.updateNetworkSettings(guestNetwork.ssid, guestNetwork.wpa_psk)

        }
    }

}

def getToken() {
    if (!state.accessToken) {
        try {
            getAccessToken()
            debug("Creating new Access Token: $state.accessToken")
        } catch (ex) {
            debug(ex)
        }
    }
}

def searchDevicesType(devType) {
    def typeDevices = []
    childDevices.each {
        if (it.getTypeName() == devType) {
            typeDevices.add(it)
        }
    }
    return typeDevices;
}

def searchDeviceStateAndType(devType, stateName, stateValue) {
    def device;
    childDevices.each {
        debug("check device type ${it.getTypeName()}")
        if (it.getTypeName() == devType) {
            def value = it.currentState(stateName).getStringValue();
            if (stateValue == value) {
                device = it;
            }
        }
    }
    return device;
}

def pollUserDevices(d) {
//return state.usersDevices;
    debug("state.usersDevices: $state.usersDevices")
    def usersDevices = state.usersDevices
    def meta = usersDevices.find { it.user == d.getName() };
    debug("meta: $meta")
    return meta;
}

def pollGuestNetwork(d) {
//return state.usersDevices;
    debug("state.usersDevices: $state.usersDevices")
    def wifiDevices = state.wifiDevices
    def meta = wifiDevices.find { it.name == d.getName() };
    debug("meta: $meta")
    return meta;
}


def apiGet(path, query) {
    def url = "${IP}:${port}";
    log.debug "request:  ${url}${path} query= ${query}"
    def result = new physicalgraph.device.HubAction(
            method: 'GET',
            path: path,
            headers: [
                    HOST  : url,
                    Accept: "*/*",
                    test  : "testData"
            ],
            query: query
    )

    return sendHubCommand(result)
}

def createMobileWifiPresence(user) {
    def deviceName = "WIFI_${user}";
    def devices = searchDevicesType("Mobile WIFI Presence")
    debug(" deviceInit=$device")
    device = devices.find {
        return it.getDeviceNetworkId() == deviceName
    }

    if (device == null) {
        device = addChildDevice("smartthings-users", "Mobile WIFI Presence", deviceName, theHub.id, [label: user, name: user])
    }
    subscribe(device, "switch.on", switchOnHandler)
    subscribe(device, "switch.off", switchOffHandler)
    device.refresh();
    return device
}

private createGuestWifi(wifiName) {
    def dni = wifiName
    def device = searchDevicesType("Asus Guest Network").find {
        it.getDeviceNetworkId() == dni
    }
    if (device == null) {
        device = addChildDevice("smartthings-users", "Asus Guest Network", dni, theHub.id, [label: wifiName, name: wifiName])
    }
    subscribe(device, "switch.on", switchOnHandler)
    subscribe(device, "switch.off", switchOffHandler)
    device.refresh();
}

def switchOnHandler(evt) {
    if (evt.getDevice().getTypeName() == "Asus Guest Network") {
        apiGet('/createGuestNetwork', [wifiName: evt.getDevice().currentState('guestWiFi').getStringValue()])
    } else if (evt.getDevice().getTypeName() == "Mobile WIFI Presence") {
        def macs = evt.getDevice().currentState('mac').getStringValue();
        apiGet('/blockMac', [macs: macs, status: "0", inLimit: "100", outLimit: "100"])
    } else {
        debug(" switchOnHandler=${evt.getDevice.getName()} ON")
    }
}


def switchOffHandler(evt) {
    if (evt.getDevice().getTypeName() == "Asus Guest Network") {
        debug("${evt.getDevice().getName()} guestWiFi=${evt.getDevice().currentState('guestWiFi').getStringValue()}")
        apiGet('/deleteGuestNetwork', [wifiName: evt.getDevice().currentState('guestWiFi').getStringValue()])
    } else if (evt.getDevice().getTypeName() == "Mobile WIFI Presence") {
        apiGet('/blockMac', [macs: evt.getDevice().currentState('mac').getStringValue(), status: "1", inLimit: "2", outLimit: "2"])
    } else {
        debug(" switchOffHandler=${evt.getDevice.getName()} ON")
    }

}

def debug(message) {
    def debug = false;
    if (debug) {
        log.debug message
    }
}



