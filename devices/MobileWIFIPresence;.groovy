metadata {
    definition(name: "Mobile WIFI Presence", namespace: "smartthings-users", author: "Vasiliy Zakharchenko", ocfDeviceType: "x.com.st.d.mobile.presence") {
        capability "Actuator"
        capability "Presence Sensor"
        capability "Sensor"
        capability "switch"
        attribute "mac", "string"
        attribute "user", "string"
        command refresh
        command getMacList
    }

    simulator {
        status "present": "presence: 1"
        status "not present": "presence: 0"
    }

    tiles {
        multiAttributeTile(name: "switch", type: "lighting", width: 6, height: 4, canChangeIcon: true) {
            tileAttribute("device.switch", key: "PRIMARY_CONTROL") {
                attributeState "on", label: '${name}', action: "switch.off", icon: "st.switches.switch.on", backgroundColor: "#79b821", nextState: "off"
                attributeState "off", label: '${name}', action: "switch.on", icon: "st.switches.switch.off", backgroundColor: "#ffffff", nextState: "On"
            }
            tileAttribute("device.presence", key: "SECONDARY_CONTROL") {
                attributeState "presence", label: '${name}', action: "present", icon: "st.presence.tile.mobile-present", backgroundColor: "#00A0DC"
                attributeState "not present", label: '${name}', action: "not presence", icon: "st.presence.tile.mobile-not-present", backgroundColor: "#ffffff"
            }

        }



        main "switch"
        details "switch"
    }
}

// def arrivedWiFi(){
//    sendEvent(name: "presence", value: 'present')
// }

// def departedWiFI(){
//    sendEvent(name: "presence", value: 'not present')
//}

// handle commands
def on() {
    changeStateOn();
}

def off() {
    changeStateOff();
}

def refresh() {
    debug("starting refreshing Device: $getDevice()")
    def meta = parent.pollUserDevices(getDevice())

    debug("mac: $meta.mac")
    def sort = meta.mac.toSorted();
    debug("sort: $sort")
    def macString = sort.join(",")
    debug("macString: $macString")
    sendEvent(name: "mac", value: macString);
    sendEvent(name: "user", value: meta.user);
    sendEvent(name: "presence", value: 'no presence');
}

def getMacList() {
    def macs = getDevice().currentState("mac").getStringValue();
    debug("macs: $macs")
    return macs.split(",");
}

private changeStateOff() {
    sendEvent(name: "switch", value: 'off')
}

private changeStateOn() {
    sendEvent(name: "switch", value: 'on')
}

def debug(message) {
    def debug = false;
    if (debug) {
        log.debug message
    }
}
