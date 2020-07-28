import { observable, action } from 'mobx';
import { fetchData, sendData } from '../utils/restCalls';

const serverUrl = process.env.SERVER_URL;

export class DevicesStore {
    @observable devices = [];

    @observable maclist = [];

    @observable blockedMacs = [];

    @observable error = undefined;

    @observable isDevicesLoading = false;

    parseState(data) {
      const res = JSON.parse(data);
      if (res.data && res.data.availableMacs) {
        this.devices = res.data.availableMacs || [];
        this.maclist = res.data.maclist || [];
        this.blockedMacs = res.data.blockedMacs || [];
      }
    }

    @action load() {
      this.isDevicesLoading = true;
      fetchData(`${serverUrl}ui/presenceMobiles`).then(action(({ data }) => {
        this.parseState(data);
      })).catch(
        action(({ data }) => {
          this.error = data;
        }),
      ).finally(action(() => {
        this.isDevicesLoading = false;
      }));
    }

    @action blockAccess(mac) {
      this.isDevicesLoading = true;
      sendData(`${serverUrl}ui/blockMac`,
        'POST',
        JSON.stringify({ macs: [mac] }), {
          'Content-Type': 'application/json',
        }).then(action(() => {
        action(UsersStore.this.load());
      })).catch(
        action(({ data }) => {
          this.error = data;
        }),
      ).finally(action(() => {
        this.isDevicesLoading = false;
      }));
    }

    @action unBlockAccess(mac) {
      this.isDevicesLoading = true;
      sendData(`${serverUrl}ui/unBlockMac`,
        'POST',
        JSON.stringify({ macs: [mac] }), {
          'Content-Type': 'application/json',
        }).then(action(() => {
        action(DevicesStore.this.load());
      })).catch(
        action(({ data }) => {
          this.error = data;
        }),
      ).finally(action(() => {
        this.isDevicesLoading = false;
      }));
    }
}

export default new DevicesStore();
