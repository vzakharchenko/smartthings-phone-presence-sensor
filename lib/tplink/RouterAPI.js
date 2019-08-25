const { sendData } = require('../restCalls');
const { config } = require('../env.js');
const logger = require('../logger.js');

const statusUrl = (router, token) => `${router.httpOrhttps}://${router
  .routerIp}:${router
  .routerPort}/cgi-bin/luci/;stok=${token}/admin/status?form=all`;

const logoutUrl = (router, token) => `${router.httpOrhttps}://${router
  .routerIp}:${router
  .routerPort}/cgi-bin/luci/;stok=${token}/admin/system?form=logout`;

const getBlackListUrl = (router, token) => `${
  router.httpOrhttps}://${router
  .routerIp}:${router
  .routerPort}/cgi-bin/luci/;stok=${token}/admin/access_control?form=black_list`;

const accessControlUrl = (router, token) => `${
  router.httpOrhttps}://${router
  .routerIp}:${router
  .routerPort}/cgi-bin/luci/;stok=${token}/admin/access_control?form=enable`;

// {
//     "success": true,
//     "data": {
//     "wireless_2g_wep_format3": "hex",
//         "wireless_5g_disabled": "off",
//         "wireless_5g_ssid": "Sobachka",
//         "guest_2g5g_psk_key": "30468700",
//         "wireless_5g_wds_status": "disable",
//         "wireless_5g_wep_format1": "hex",
//         "storage_capacity": 0,
//         "access_devices_wired": [
//         {
//             "wire_type": "wired",
//             "macaddr": "02-85-09-42-C0-46",
//             "ipaddr": "192.168.0.126",
//             "hostname": "adBlock"
//         }
//     ],
//         "wireless_2g_wds_status": "disable",
//         "wireless_2g_wep_type3": "64",
//         "wireless_2g_wep_format2": "hex",
//         "wireless_2g_enable": "on",
//         "wireless_2g_wpa_key": "",
//         "guest_2g5g_encryption": "psk",
//         "wireless_2g_disabled": "off",
//         "guest_5g_extinfo": {
//         "wds_guest_compatible": "no",
//             "support_wds_show": "no",
//             "support_band": "both",
//             "support_guest_dynpasswd": "yes",
//             "wds2g_wds5g_compatible": "no"
//     },
//     "cpu_usage": 0,
//         "wireless_5g_encryption": "psk",
//         "wireless_2g_wep_mode": "auto",
//         "guest_5g_hidden": "off",
//         "guest_access": "on",
//         "lan_ipv4_ipaddr": "192.168.0.1",
//         "guest_2g_enable": "on",
//         "wireless_5g_wep_mode": "auto",
//         "access_devices_wireless_host": [
//         {
//             "wire_type": "2.4G",
//             "macaddr": "F4-C2-48-F9-12-E7",
//             "ipaddr": "192.168.0.151",
//             "hostname": "Galaxy-J6"
//         },
//         {
//             "wire_type": "5G",
//             "macaddr": "EC-1F-72-F2-E9-7D",
//             "ipaddr": "192.168.0.141",
//             "hostname": "Galaxy-S6"
//         },
//         {
//             "wire_type": "2.4G",
//             "macaddr": "A8-9F-BA-A3-C1-C9",
//             "ipaddr": "192.168.0.169",
//             "hostname": "android-82732f99b34a6b2a"
//         },
//         {
//             "wire_type": "5G",
//             "macaddr": "2C-0E-3D-2E-CC-76",
//             "ipaddr": "192.168.0.102",
//             "hostname": "Samsung-Galaxy-S7-edge"
//         },
//         {
//             "wire_type": "2.4G",
//             "macaddr": "04-85-30-5F-9C-5B",
//             "ipaddr": "192.168.0.111",
//             "hostname": "android-b00153a09808ef05"
//         },
//         {
//             "wire_type": "5G",
//             "macaddr": "34-36-3B-D2-CC-AC",
//             "ipaddr": "192.168.0.128",
//             "hostname": "MACBOOKPRO-CCAC"
//         }
//     ],
//         "wan_ipv6_conntype": "none",
//         "wireless_5g_current_channel": "149",
//         "wireless_2g_port": "1812",
//         "wireless_2g_wpa_cipher": "auto",
//         "wireless_2g_wep_key2": "",
//         "wireless_2g_htmode": "auto",
//         "wireless_2g_txpower": "high",
//         "wireless_2g_wep_key3": "",
//         "lan_ipv6_link_local_addr": "FE80::EE08:6BFF:FE83:9FFC/64",
//         "wan_ipv6_pridns": "::",
//         "wireless_2g_current_channel": "11",
//         "wireless_2g_wep_select": "1",
//         "wireless_2g_wep_type2": "64",
//         "wireless_5g_wep_select": "1",
//         "wireless_2g_psk_key": "spoterma",
//         "wireless_2g_wep_type1": "64",
//         "wireless_5g_wep_format2": "hex",
//         "wireless_2g_wep_key1": "",
//         "wireless_5g_wep_format3": "hex",
//         "wan_ipv4_snddns": "212.79.122.26",
//         "guest_5g_disabled": "off",
//         "wireless_5g_extinfo": {
//         "wds_guest_compatible": "no",
//             "support_wds_show": "no",
//             "support_band": "both",
//             "support_guest_dynpasswd": "yes",
//             "wds2g_wds5g_compatible": "no"
//     },
//     "guest_2g_hidden": "off",
//         "wireless_2g_channel": "auto",
//         "wireless_5g_server": "",
//         "wireless_2g_extinfo": {
//         "wds_guest_compatible": "no",
//             "support_wds_show": "no",
//             "support_band": "both",
//             "support_guest_dynpasswd": "yes",
//             "wds2g_wds5g_compatible": "no"
//     },
//     "wireless_2g_wpa_version": "auto",
//         "wireless_5g_psk_key": "spoterma",
//         "wireless_2g_wep_format4": "hex",
//         "lan_ipv4_netmask": "255.255.255.0",
//         "wireless_2g_wep_format1": "hex",
//         "wireless_5g_wep_type1": "64",
//         "wireless_5g_wep_type2": "64",
//         "wireless_5g_wep_key1": "",
//         "lan_macaddr": "EC-08-6B-83-9F-FC",
//         "wireless_2g_encryption": "psk",
//         "printer_count": 0,
//         "wireless_5g_port": "1812",
//         "wireless_5g_wps_state": "configured",
//         "wireless_5g_wpa_cipher": "auto",
//         "storage_available": 0,
//         "wireless_5g_hwmode": "anac_5",
//         "wan_ipv6_gateway": "::",
//         "printer_name": "None",
//         "wireless_5g_enable": "on",
//         "wireless_5g_wep_type4": "64",
//         "wan_ipv6_snddns": "::",
//         "wireless_5g_wep_key2": "",
//         "wireless_5g_txpower": "high",
//         "wan_ipv6_ip6addr": "::",
//         "wireless_2g_hidden": "off",
//         "wireless_2g_psk_version": "auto",
//         "guest_isolate": "on",
//         "wan_macaddr": "EC-08-6B-83-9F-FD",
//         "wireless_2g_server": "",
//         "wireless_2g_wps_state": "configured",
//         "wireless_5g_hidden": "off",
//         "wireless_5g_psk_version": "auto",
//         "wireless_5g_wep_key4": "",
//         "wireless_2g_ssid": "Koshechka",
//         "mem_usage": 0.16,
//         "wireless_5g_disabled_all": "off",
//         "wan_ipv4_ipaddr": "10.30.5.145",
//         "guest_2g_extinfo": {
//         "wds_guest_compatible": "no",
//             "support_wds_show": "no",
//             "support_band": "both",
//             "support_guest_dynpasswd": "yes",
//             "wds2g_wds5g_compatible": "no"
//     },
//     "lan_ipv6_assign_type": "slaac",
//         "wan_ipv4_netmask": "255.255.255.255",
//         "wireless_2g_disabled_all": "off",
//         "lan_ipv6_ipaddr": "FE80::EE08:6BFF:FE83:9FFC/64",
//         "wireless_5g_wpa_key": "",
//         "wireless_5g_htmode": "auto",
//         "guest_2g_disabled": "off",
//         "guest_2g_ssid": "Koshka_Guest",
//         "wan_ipv4_gateway": "212.79.122.1",
//         "guest_5g_enable": "on",
//         "wireless_2g_wep_key4": "",
//         "guest_5g_ssid": "Sobachka_Guest",
//         "guest_2g5g_passwd_cycle": "weekly",
//         "guest_2g5g_psk_cipher": "auto",
//         "wireless_2g_wep_type4": "64",
//         "wireless_5g_wep_format4": "hex",
//         "wireless_5g_macaddr": "EC-08-6B-83-9F-FA",
//         "lan_ipv4_dhcp_enable": "On",
//         "wireless_2g_psk_cipher": "auto",
//         "wireless_2g_macaddr": "EC-08-6B-83-9F-FB",
//         "wireless_2g_hwmode": "bgn",
//         "wireless_5g_channel": "auto",
//         "wan_ipv6_enable": "off",
//         "wan_ipv4_pridns": "212.79.122.25",
//         "guest_2g5g_psk_version": "auto",
//         "wireless_5g_wep_key3": "",
//         "wireless_5g_psk_cipher": "auto",
//         "wireless_5g_wpa_version": "auto",
//         "wireless_5g_wep_type3": "64",
//         "storage_capacity_unit": "B",
//         "wan_ipv4_conntype": "pppoe",
//         "storage_vendor": "",
//         "storage_available_unit": "B"
// }
// }


function getRouterInfo(token) {
  return new Promise((resolve, reject) => {
    const url = statusUrl(config().router, token.stok);
    sendData(
      `${url}`,
      'POST',
      'operation=read',
      { 'Content-Type': 'application/x-www-form-urlencoded', cookie: token.header },
    )
      .then((res) => {
        const json = JSON.parse(res);
        if (json.success) {
          const { data } = json;
          resolve(data);
        } else {
          reject(json.errorcode);
        }
      }).catch((err) => {
        reject(err);
      });
  });
}

function getBlackList(token) {
  return new Promise((resolve, reject) => {
    const url = getBlackListUrl(config().router, token.stok);
    sendData(
      `${url}`,
      'POST',
      'operation=load',
      { 'Content-Type': 'application/x-www-form-urlencoded', cookie: token.header },
    )
      .then((res) => {
        const json = JSON.parse(res);
        if (json.success) {
          const { data } = json;
          const resp = [];
          if (Array.isArray(data)) {
            data.forEach((entry) => {
              resp.push(entry.mac.replace(/-/g, ':'));
            });
          }
          resolve(resp);
        } else {
          reject(json.errorcode);
        }
      }).catch((err) => {
        reject(err);
      });
  });
}

function accessControl(token) {
  return new Promise((resolve, reject) => {
    const url = accessControlUrl(config().router, token.stok);
    sendData(
      `${url}`,
      'POST',
      'operation=read',
      { 'Content-Type': 'application/x-www-form-urlencoded', cookie: token.header },
    )
      .then((res) => {
        const json = JSON.parse(res);
        if (json.success) {
          const { data } = json;
          resolve(data.enable === 'on');
        } else {
          reject(json.errorcode);
        }
      }).catch((err) => {
        reject(err);
      });
  });
}

function activateAccessControl(token) {
  return new Promise((resolve, reject) => {
    const url = accessControlUrl(config().router, token.stok);
    sendData(
      `${url}`,
      'POST',
      'operation=write&enable=on',
      { 'Content-Type': 'application/x-www-form-urlencoded', cookie: token.header },
    )
      .then((res) => {
        const json = JSON.parse(res);
        if (json.success) {
          const { data } = json;
          resolve(data.enable === 'on');
        } else {
          reject(json.errorcode);
        }
      }).catch((err) => {
        reject(err);
      });
  });
}

function logout(token) {
  return new Promise((resolve, reject) => {
    const url = logoutUrl(config().router, token.stok);
    sendData(
      `${url}`,
      'POST',
      'operation=write',
      { 'Content-Type': 'application/x-www-form-urlencoded', cookie: token.header },
    )
      .then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
  });
}


function activateBlockMac(token) {
  return new Promise((resolve, reject) => {
    accessControl(token).then((active) => {
      if (active) {
        resolve();
      } else {
        activateAccessControl(token).then(() => {
          resolve();
        }).catch(reject);
      }
    });
  });
}

function addBlackList(token, mac) {
  return new Promise((resolve, reject) => {
    activateBlockMac(token).then(() => {
      getBlackList(token).then((macs) => {
        const findMacs = macs.filter(m => (m === mac));
        if (findMacs && findMacs.length > 0) {
          resolve(macs);
        } else {
          const url = getBlackListUrl(config().router, token.stok);
          const postData = 'operation=insert&key=add&index=0'
              + '&old=add&new=%7B%22name%22'
              + `%3A%22${`smartThing_block${macs.length}`}%22%2C%22mac%22%3A%22${mac}%22%7D`;
          logger.debug(`postDAta=${postData}`);
          sendData(
            `${url}`,
            'POST',
            postData,
            { 'Content-Type': 'application/x-www-form-urlencoded', cookie: token.header },
          )
            .then((res) => {
              const json = JSON.parse(res);
              if (json.success) {
                const { data } = json;
                const resp = [];
                if (Array.isArray(data)) {
                  data.forEach((entry) => {
                    resp.push(entry.mac);
                  });
                }
                resolve(resp);
              } else {
                reject(json.errorcode);
              }
            }).catch((err) => {
              reject(err);
            });
        }
      }).catch(reject);
    }).catch(reject);
  });
}

function deleteBlackList(token, mac) {
  return new Promise((resolve, reject) => {
    activateBlockMac(token).then(() => {
      getBlackList(token).then((macs) => {
        const findMacs = macs.filter(m => (m === mac));
        if (!findMacs || findMacs.length === 0) {
          resolve(macs);
        } else {
          const url = getBlackListUrl(config().router, token.stok);
          const pos = macs.indexOf(mac);
          sendData(
            `${url}`,
            'POST',
            `operation=remove&key=key-1&index=${pos}`,
            { 'Content-Type': 'application/x-www-form-urlencoded', cookie: token.header },
          )
            .then((res) => {
              const json = JSON.parse(res);
              if (json.success) {
                const { data } = json;
                const resp = [];
                if (Array.isArray(data)) {
                  data.forEach((entry) => {
                    resp.push(entry.mac);
                  });
                }
                resolve(resp);
              } else {
                reject(json.errorcode);
              }
            }).catch((err) => {
              reject(err);
            });
        }
      }).catch(reject);
    }).catch(reject);
  });
}

module.exports.getRouterInfo = getRouterInfo;
module.exports.logout = logout;
module.exports.getBlackList = getBlackList;
module.exports.activateBlockMac = activateBlockMac;
module.exports.addBlackList = addBlackList;
module.exports.deleteBlackList = deleteBlackList;
