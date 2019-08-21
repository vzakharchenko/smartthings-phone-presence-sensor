/**
 *  WiFi Mobile Presente
 *
 *  Copyright 2019 Василий Захарченко
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 *  in compliance with the License. You may obtain a copy of the License at:
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed
 *  on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License
 *  for the specific language governing permissions and limitations under the License.
 *
 */
definition(
        name: "WiFi Mobile Presence",
        namespace: "vzakharchenko",
        author: "Vasyl Zakharchenko",
        description: "WiFi Mobile Presence. How to use: https://github.com/vzakharchenko/smartthings_asus_router",
        category: "My Apps",
        iconUrl: "https://cdn3.iconfinder.com/data/icons/mobile-1/100/Icon_SmartphoneWiFi2-512.png",
        iconX2Url: "https://cdn3.iconfinder.com/data/icons/mobile-1/100/Icon_SmartphoneWiFi2-512.png",
        iconX3Url: "https://cdn3.iconfinder.com/data/icons/mobile-1/100/Icon_SmartphoneWiFi2-512.png")


preferences {
    page(name: "config", content: "config", refreshTimeout: 5)
}

def config() {

    if (!state.subscribe) {
        subscribe(location, "ssdpTerm." + getURN(), locationHandler)
        state.subscribe = true
    }
    int refreshCount = !state.refreshCount ? 0 : state.refreshCount as int
    state.refreshCount = refreshCount + 1
    def refreshInterval = refreshCount == 0 ? 2 : 5
    //ssdp request every fifth refresh
    if ((refreshCount % 5) == 0) {
        ssdpDiscover();
    }

    if (state.ip && state.port) {
        refreshInterval = 0
    }

    dynamicPage(name: "config", title: " WiFi Mobile Manager", refreshInterval: refreshInterval) {


        section("Setup my device with this IP") {
            input "IP", "string", multiple: false, required: true, defaultValue: state.ip
        }
        section("Setup my device first port") {
            input "port", "number", multiple: false, required: true, defaultValue: state.port
        }
        section("on this hub...") {
            input "theHub", "hub", multiple: false, required: true, defaultValue: state.hub
        }
        section("Presente Device") {
            input "presentDevice", "device.simulatedPresenceSensor", multiple: false, required: true
        }
    }
}

def installed() {
    createAccessToken()
    getToken()
    initialize()
}

def getURN() {
    return "urn:wifimobile:device:vzakharchenko:1"
}

void ssdpDiscover() {
    sendHubCommand(new physicalgraph.device.HubAction("lan discovery " + getURN(), physicalgraph.device.Protocol.LAN))
}

def updated() {
    log.debug "Updated with settings: ${settings}"

    unsubscribe()
    initialize()
}

def initialize() {
    unsubscribe();
    if (IP && port && theHub && presentDevice) {
        apiPost("/registerDevice", null, [name: presentDevice.getId(), secret: state.accessToken, appId: app.id, label: presentDevice.getLabel()])
    }
    // TODO: subscribe to attributes, devices, locations, etc.
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
}

def responsePresent() {
    def json = request.JSON
    debug("json: $json")
    def maclist = json.maclist;
    def mac = searchMac(maclist, state.macs);
    if (mac != null) {
        sendPresentEvent();
    } else {
        sendNoPresentEvent();
    }
    return ["status": "ok"]
}

def searchMac(maclist, macs) {
    return maclist.find { it in macs }
}

def routerInitialization() {
    def json = request.JSON;
    debug("json: $json")
    debug("json.users = ${json.users}")
    debug("json.guestWiFi = ${json.guestWiFi}")
    def usersDevices = filterUsersDevices(json.users);
    debug("usersDevices =${usersDevices}");
    state.backendInitialized = true;
    return [status: "ok"]
}

def filterUsersDevices(usersDevices) {
    usersDevices.each {
        def user = it.user
        def mac = it.mac
        if (presentDevice.getId() == user) {
            state.macs = mac;
        }
    }
}


def debug(message) {
    def debug = false
    if (debug) {
        log.debug message
    }
}

//def apiGet(path, query) {
//    def url = "${IP}:${port}";
//    log.debug "request:  ${url}${path} query= ${query}"
//    def result = new physicalgraph.device.HubAction(
//            method: 'GET',
//            path: path,
//            headers: [
//                    HOST  : url,
//                    Accept: "*/*",
//                    test  : "testData"
//            ],
//            query: query
//    )
//
//    return sendHubCommand(result)
//}

def sendPresentEvent() {
    if (presentDevice.hasCommand("arrived")) {
        presentDevice.arrived();
    } else if (getLastState() != "present") {
        debug("current state=${getLastState()}, new state present");
        sendLocationEvent(name: "presence", value: "present", deviceId: presentDevice.getId(), source: "DEVICE", isStateChange: true)
        presentDevice.arrived();
    }
}


def sendNoPresentEvent() {
    if (presentDevice.hasCommand("departed")) {
        presentDevice.departed();
    } else if (getLastState() != "not present") {
        debug("current state=${getLastState()}, new state not present");
        sendLocationEvent(name: "presence", value: "not present", deviceId: presentDevice.getId(), source: "DEVICE", isStateChange: true)
    }
}

def getLastState() {
    def events = presentDevice.events(max: 1);
    if (events && events.size() == 1) {
        def event = events.get(0);
        return event.value;
    } else {
        return null;
    }
}

def apiPost(path, query, body) {
    def url = "${IP}:${port}";
    log.debug "request:  ${url}${path} query= ${query}"
    def result = new physicalgraph.device.HubAction(
            method: 'POST',
            path: path,
            headers: [
                    HOST          : url,
                    Accept        : "*/*",
                    "Content-Type": "application/json"
            ],
            body: new groovy.json.JsonBuilder(body).toPrettyString(),
            query: query
    )

    return sendHubCommand(result)
}

def locationHandler(evt) {
    def description = evt?.description
    debug("event: ${description}");
    def urn = getURN()
    def hub = evt?.hubId
    def parsedEvent = parseEventMessage(description)
    state.hub = hub
    if (parsedEvent?.ssdpTerm?.contains(urn)) {
        state.ip = convertHexToIP(parsedEvent.ip)
        state.port = convertHexToInt(parsedEvent.port)
    }

}

def String convertHexToIP(hex) {
    [convertHexToInt(hex[0..1]), convertHexToInt(hex[2..3]), convertHexToInt(hex[4..5]), convertHexToInt(hex[6..7])].join(".")
}

def Integer convertHexToInt(hex) {
    Integer.parseInt(hex, 16)
}

private def parseEventMessage(String description) {
    def event = [:]
    def parts = description.split(',')

    parts.each
            { part ->
                part = part.trim()
                if (part.startsWith('devicetype:')) {
                    def valueString = part.split(":")[1].trim()
                    event.devicetype = valueString
                } else if (part.startsWith('mac:')) {
                    def valueString = part.split(":")[1].trim()
                    if (valueString) {
                        event.mac = valueString
                    }
                } else if (part.startsWith('networkAddress:')) {
                    def valueString = part.split(":")[1].trim()
                    if (valueString) {
                        event.ip = valueString
                    }
                } else if (part.startsWith('deviceAddress:')) {
                    def valueString = part.split(":")[1].trim()
                    if (valueString) {
                        event.port = valueString
                    }
                } else if (part.startsWith('ssdpPath:')) {
                    def valueString = part.split(":")[1].trim()
                    if (valueString) {
                        event.ssdpPath = valueString
                    }
                } else if (part.startsWith('ssdpUSN:')) {
                    part -= "ssdpUSN:"
                    def valueString = part.trim()
                    if (valueString) {
                        event.ssdpUSN = valueString

                        def uuid = getUUIDFromUSN(valueString)

                        if (uuid) {
                            event.uuid = uuid
                        }
                    }
                } else if (part.startsWith('ssdpTerm:')) {
                    part -= "ssdpTerm:"
                    def valueString = part.trim()
                    if (valueString) {
                        event.ssdpTerm = valueString
                    }
                } else if (part.startsWith('headers')) {
                    part -= "headers:"
                    def valueString = part.trim()
                    if (valueString) {
                        event.headers = valueString
                    }
                } else if (part.startsWith('body')) {
                    part -= "body:"
                    def valueString = part.trim()
                    if (valueString) {
                        event.body = valueString
                    }
                }
            }

    event
}

def getUUIDFromUSN(usn) {
    def parts = usn.split(":")

    for (int i = 0; i < parts.size(); ++i) {
        if (parts[i] == "uuid") {
            return parts[i + 1]
        }
    }
}
