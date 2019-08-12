import { observable, action } from 'mobx';

export class TabsStore {
    @observable tabId = 'Info';

    @action setTab(tabId) {
      this.tabId = tabId;
    }
}

export default new TabsStore();
