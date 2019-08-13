import React from 'react';
import { inject, observer } from 'mobx-react';
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';
import TabContent from 'react-bootstrap/lib/TabContent';
import InfoTab from './InfoTab';
import UsersTab from './UsersTab';
import DevicesTab from './DevicesTab';
import ServerTab from './ServerTab';
import SmartAppTab from './SmartAppTab';
import AsusTab from './AsusTab';


export default
@inject('tabsStore', 'componentStateStore')
@observer
class RouterTabs extends React.Component {
    handleChange = (event, value) => {
      this.props.tabsStore.setTab(value);
    };

    selectInfo() {
      this.props.tabsStore.setTab('Info');
    }

    render() {
      const { tabId } = this.props.tabsStore;
      const {
        users, devices, serverConfig, smartapp, asus,
      } = this.props.componentStateStore;
      return (
        <div>
          <Tabs defaultActiveKey={tabId} id="uncontrolled-tab-example">
            <Tab eventKey="Info" title="Info">
              <TabContent>
                <InfoTab />
              </TabContent>
            </Tab>
            {serverConfig ? (
              <Tab eventKey="ServerConfig" title="Server Config">
                <TabContent>
                  <ServerTab />
                </TabContent>
              </Tab>
            ) : null}
            {asus ? (
              <Tab eventKey="Assus" title="Asus Router Config">
                <TabContent>
                  <AsusTab />
                </TabContent>
              </Tab>
            ) : null}
            {smartapp ? (
              <Tab eventKey="SmartApp" title="SmartApp Config">
                <TabContent>
                  <SmartAppTab />
                </TabContent>
              </Tab>
            ) : null}
            {users ? (
              <Tab eventKey="Users" title="Users">
                <TabContent>
                  <UsersTab />
                </TabContent>
              </Tab>
            ) : null}
            {devices ? (
              <Tab eventKey="Devices" title="Devices">
                <TabContent>
                  <DevicesTab />
                </TabContent>
              </Tab>
            ) : null}
          </Tabs>
        </div>
      );
    }
}
