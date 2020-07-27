metadata {
    // Automatically generated. Make future change here.
    definition (name: "WiFi Presence Sensor", namespace: "vzakharchenko", author: "vzakharchenko") {
        capability "Presence Sensor"
        capability "Sensor"
        capability "Health Check"

        command "arrived"
        command "departed"
    }

    tiles {
        standardTile("presence", "device.presence", width: 2, height: 2, canChangeBackground: true) {
            state("not present", label:'not present', icon:"st.presence.tile.not-present", backgroundColor:"#ffffff", action:"arrived")
            state("present", label:'present', icon:"st.presence.tile.present", backgroundColor:"#00A0DC", action:"departed")
        }
        main "presence"
        details "presence"
    }
}


def installed() {
    initialize()
}

def updated() {
    initialize()
}

def initialize() {
    sendEvent(name: "DeviceWatch-DeviceStatus", value: "online")
    sendEvent(name: "healthStatus", value: "online")
    sendEvent(name: "DeviceWatch-Enroll", value: [protocol: "cloud", scheme:"untracked"].encodeAsJson(), displayed: false)
}

// handle commands
def arrived() {
    log.trace "Executing 'arrived'"
    sendEvent(name: "presence", value: "present")
}


def departed() {
    log.trace "Executing 'departed'"
    sendEvent(name: "presence", value: "not present")
}