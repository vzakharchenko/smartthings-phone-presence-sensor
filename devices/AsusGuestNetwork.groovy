metadata {
    definition(name: "Asus Guest Network",
            namespace: "smartthings-users",
            author: "Vasiliy Zakharchenko",
            ocfDeviceType: "oic.d.switch") {
        capability "Actuator"
        capability "Switch"
        capability "Sensor"
        attribute "guestWiFi", "string"
        attribute "guestWiFiId", "string"
        attribute "ssid", "string"
        attribute "wpa_psk", "string"
        attribute "wpa_psk_type", "string"
        attribute "startDate", "date"
        command refresh;
        command updateNetworkSettings;
        command getSSID;
    }

    tiles(scale: 1) {
        standardTile("button", "device.switch", width: 3, height: 2, canChangeIcon: true) {
            state "off", label: 'WiFi  Off', action: "switch.on", icon: "st.switches.switch.off", backgroundColor: "#ffffff", nextState: "on"
            state "on", label: 'WiFi On', action: "switch.off", icon: "st.switches.switch.on", backgroundColor: "#00A0DC", nextState: "off"
        }
        valueTile("ssid", "device.ssid", width: 3, height: 1) {
            state "ssid", label: '${currentValue}\n'
        }
        valueTile("wpa_psk", "device.wpa_psk", width: 3, height: 1) {
            state "wpa_psk", label: '${currentValue}\n'
        }
        main "button"
        details(["button", "ssid", "wpa_psk"])
    }
    preferences {
        section("Guest WiFi Network Name") {
            input("ssid", "text", title: "New Network Name (SSID)", required: false, description: "Guest WiFi Network Name (SSID)")
        }


    }
}
// handle commands
def on() {
    changeStateOn();
}

def off() {
    changeStateOff();
}

def changeStateOff() {
    sendEvent(name: "switch", value: 'off')
}

def changeStateOn() {
    sendEvent(name: "switch", value: 'on')
}

def updateNetworkSettings(ssid, wpa_psk) {
    sendEvent(name: "ssid", value: ssid);
    sendEvent(name: "wpa_psk", value: wpa_psk);
    sendEvent(name: "wpa_psk_type", value: "OneDayPassword");
}

def initialize() {
    if (settings.ssid != null) {
        sendEvent(name: "ssid", value: settings.ssid);
    }
}

def installed() {
    initialize();
}

def updated() {
    initialize();
}

def getSSID() {
    if (settings.ssid != null) {
        return settings.ssid;
    }
    return getDevice().currentState("ssid").getStringValue();
}

def refresh() {
    debug("starting refreshing Device: $getDevice()")
    def meta = parent.pollGuestNetwork(getDevice())
    sendEvent(name: "ssid", value: "SmartThings");
    sendEvent(name: "wpa_psk", value: "");
    sendEvent(name: "switch", value: "off");
    sendEvent(name: "startDate", value: new Date(0));
    sendEvent(name: "guestWiFi", value: meta.name);
    sendEvent(name: "guestWiFiId", value: meta.id);
    sendEvent(name: "wpa_psk_type", value: "OneDayPassword");


    ssid
}

def debug(message) {
    def debug = false;
    if (debug) {
        log.debug message
    }
}

