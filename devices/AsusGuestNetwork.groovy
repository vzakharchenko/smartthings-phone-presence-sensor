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
    }

    tiles {
        standardTile("button", "device.switch", width: 2, height: 2, canChangeIcon: true) {
            state "off", label: 'Off', action: "switch.on", icon: "st.switches.switch.off", backgroundColor: "#ffffff", nextState: "on"
            state "on", label: 'On', action: "switch.off", icon: "st.switches.switch.on", backgroundColor: "#00A0DC", nextState: "off"
        }
        main "button"
        details "button"
    }
    preferences {
        page(name: "config");

    }
}

def config() {
    dynamicPage(name: "config", title: "Asus Guest Network", refreshInterval: 2) {


        section("Guest WiFi Network Name") {
            input("ssid", "text", title: "Network Name (SSID)", required: true, description: "Guest WiFi Network Name (SSID)", defaultValue: state.ssid)
        }
        section("WiFi Password Settings") {
            input("wpa_psk_type", "enum", title: "What Password do you whant to use", required: true, description: "Password Type", options: [
                    "StaticPassword" : "Your Password",
                    "OneDayPassword" : "One Day Password",
                    "OneWeekPassword": "One Week Password"
            ], "defaultValue": state.wpa_psk_type)
        }

        section(wpa_psk_type == "StaticPassword") {
            input("wpa_psk", "text", title: "Network Key (Password) ", required: false, description: "Guest WiFi Password")
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
}

def installed() {
    initialize();
}

def updated() {
    initialize();
}

def refresh() {
    debug("starting refreshing Device: $getDevice()")
    def meta = parent.pollGuestNetwork(getDevice())
    sendEvent(name: "ssid", value: "");
    sendEvent(name: "wpa_psk", value: "");
    sendEvent(name: "switch", value: "off");
    sendEvent(name: "startDate", value: new Date(0));
    sendEvent(name: "guestWiFi", value: meta.name);
    sendEvent(name: "guestWiFiId", value: meta.id);

    ssid
}

def debug(message) {
    def debug = true;
    if (debug) {
        log.debug message
    }
}

