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
        command arrivedWiFi
        command departedWiFI
    }

    simulator {
        status "present": "presence: 1"
        status "not present": "presence: 0"
    }

    tiles(scale: 2) {

        standardTile("presence", "device.presence", width: 6, height: 2, canChangeBackground: true) {
            state("present", action: "present", labelIcon: "st.presence.tile.mobile-present", backgroundColor: "#53a7c0")
            state("not present", action: " not present", labelIcon: "st.presence.tile.mobile-not-present", backgroundColor: "#ffffff")
        }

        standardTile("switch", "device.switch", width: 6, height: 4, canChangeIcon: true) {
            state "off", label: 'Internet', action: "switch.on",
                    icon: "st.switches.switch.off", backgroundColor: "#ffffff"
            state "on", label: 'Internet', action: "switch.off",
                    icon: "st.switches.switch.on", backgroundColor: "#00a0dc"
        }

        valueTile("mac", "device.mac", width: 3, height: 1) {
            state "mac", label: '${currentValue}\n', unit: "KWh"
        }

        // the "switch" tile will appear in the Things view
        main("presence")

        // the "switch" and "power" tiles will appear in the Device Details
        // view (order is left-to-right, top-to-bottom)
        details(["presence", "switch", "mac"])
    }
}

def arrivedWiFi() {
    sendEvent(name: "presence", value: 'present')
}

def departedWiFI() {
    sendEvent(name: "presence", value: 'not present')
}

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
