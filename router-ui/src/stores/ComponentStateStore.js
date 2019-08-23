import { action, observable } from 'mobx';
import { fetchData, sendData } from '../utils/restCalls';

const serverUrl = process.env.SERVER_URL;


export class ComponentStateStore {
    @observable users = false;

    @observable macs = false;

    @observable networks = false;

    @observable asus = false;

    @observable tpLink = false;

    @observable mikrotik = false;

    @observable devices = false;

    @observable serverConfig = false;

    @observable smartapp = false;

    @observable error = undefined;

    @observable isLoading = false;

    @observable isSettingLoading = false;

    @observable serverSetting = null;

    @observable smartappSetting = null;

    @observable asusSetting = null;

    @observable routerMessage = null;

    @observable smartThingMessage = null;

    @observable routerError = false;

    @observable smartThingError = false;

    @observable components = [];

    @observable status = null;

    @observable smartappUrl = null;

    parseState(data) {
      const res = JSON.parse(data);
      this.users = res.data.includes('users');
      this.macs = res.data.includes('macs');
      this.networks = res.data.includes('networks');
      this.asus = res.data.includes('asus');
      this.error = res.data.includes('message');
      this.devices = res.data.includes('devices');
      this.serverConfig = res.data.includes('serverConfig');
      this.smartapp = res.data.includes('smartapp');
      this.routerError = res.data.includes('routerError');
      this.smartThingError = res.data.includes('smartThingError');
      this.tpLink = res.data.includes('tpLink');
      this.mikrotik = res.data.includes('mikrotik');
      this.components = res.data;
      this.status = res.status;
      this.routerMessage = res.routerMessage;
      this.smartThingMessage = res.smartThingMessage;
    }

    parseSetting(data) {
      const res = JSON.parse(data);
      this.serverSetting = res.data.server;
      this.smartappSetting = res.data.smartapp;
      this.asusSetting = res.data.router;
    }


    @action load() {
      this.isLoading = true;
      fetchData(`${serverUrl}ui/components`).then(action(({ data }) => {
        this.parseState(data);
      })).catch(
        action(({ data }) => {
          this.error = data;
        }),
      ).finally(action(() => {
        this.isLoading = false;
      }));
    }

    @action settingLoad() {
      this.isSettingLoading = true;
      fetchData(`${serverUrl}ui/settings`).then(action(({ data }) => {
        this.parseSetting(data);
      })).catch(
        action(({ data }) => {
          this.error = data;
        }),
      ).finally(action(() => {
        this.isSettingLoading = false;
      }));
    }

    @action serverSettingSave() {
      this.isSettingLoading = true;
      sendData(`${serverUrl}ui/settings`,
        'POST',
        JSON.stringify({
          server: {
            port: this.serverSetting.port,
            debug: this.serverSetting.debug,
            mobilePresenceJob: this.serverSetting.mobilePresenceJob,
          },
        }), {
          'Content-Type': 'application/json',
        }).then(action(({ data }) => {
        this.parseSetting(data);
      })).catch(
        action(({ data }) => {
          this.error = data;
        }),
      ).finally(action(() => {
        this.isSettingLoading = false;
      }));
    }

    @action smartAppSave() {
      this.isSettingLoading = true;
      sendData(`${serverUrl}ui/settings`,
        'POST',
        JSON.stringify({
          smartapp: this.smartappSetting,
        }), {
          'Content-Type': 'application/json',
        }).then(action(({ data }) => {
        this.parseSetting(data);
      })).catch(
        action(({ data }) => {
          this.error = data;
        }),
      ).finally(action(() => {
        this.isSettingLoading = false;
      }));
    }

    @action addShard() {
      if (this.smartappUrl) {
        this.smartappSetting.push(this.smartappUrl);
        action(this.smartAppSave());
      }
    }

    @action asusSave() {
      this.isSettingLoading = true;
      sendData(`${serverUrl}ui/settings`,
        'POST',
        JSON.stringify({
          router: this.asusSetting,
        }), {
          'Content-Type': 'application/json',
        }).then(action(({ data }) => {
        this.parseSetting(data);
      })).catch(
        action(({ data }) => {
          this.error = data;
        }),
      ).finally(action(() => {
        this.isSettingLoading = false;
      }));
    }

    @action setSettingData(elementName, elementValue) {
      this.serverSetting[elementName] = elementValue;
    }

    @action modifyShard(elementValue) {
      this.smartappUrl = elementValue;
    }

    @action setAsusSetting(elementName, elementValue) {
      this.asusSetting[elementName] = elementValue;
    }
}

export default new ComponentStateStore();
