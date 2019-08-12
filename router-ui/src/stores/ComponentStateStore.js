import { observable, action } from 'mobx';
import { fetchData, sendData } from '../utils/restCalls';

const serverUrl = process.env.SERVER_URL;


export class ComponentStateStore {

    @observable users = false;

    @observable macs = false;
    @observable networks = false;
    @observable asus = false;
    @observable devices = false;

    @observable error = undefined;

    @observable isLoading = false;

    parseState(data) {
        const res = JSON.parse(data);
        this.users = res.data.includes('users');
        this.macs = res.data.includes('users');
        this.networks = res.data.includes('networks');
        this.asus = res.data.includes('asus');
        this.error = res.data.includes('message');
        this.devices = res.data.includes('devices');
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
}

export default new ComponentStateStore();
