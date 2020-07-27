import React from 'react';
import { inject, observer } from 'mobx-react';
import {
  Button, ControlLabel, FormControl, Table,
} from 'react-bootstrap';
import Loading from './Loading';

export default
@inject('componentStateStore')
@observer
class ServerTab extends React.Component {
  componentDidMount() {
    if (!this.props.componentStateStore.isSettingLoading) {
      this.props.componentStateStore.settingLoad();
    }
  }

    handlePortChange = (event, value) => {
      this.props.componentStateStore.setSettingData('port', value || event.target.value);
    };

    handleMobilePresenceJobChange = (event, value) => {
      this.props.componentStateStore.setSettingData('mobilePresenceJob', value || event.target.value);
    };

    handleDebugChange = (event) => {
      this.props.componentStateStore.setSettingData('debug', event.target.checked);
    };

    saveHandle = () => {
      this.props.componentStateStore.serverSettingSave();
    };

    render() {
      const {
        serverSetting, isSettingLoading,
      } = this.props.componentStateStore;
      return (isSettingLoading ? <Loading /> : (
        <Table striped bordered condensed hover>
          <thead />
          <tbody>
            <tr>
              <td>
                <ControlLabel>Server Port</ControlLabel>
                <FormControl
                  type="number"
                  name="port"
                  placeholder="port"
                  value={serverSetting ? serverSetting.port : 0}
                  onChange={this.handlePortChange}
                />
              </td>
              <td>
                <ControlLabel>Server Debug</ControlLabel>
                {serverSetting && serverSetting.debug
                  ? (
                    <FormControl
                      type="checkbox"
                      name="debug"
                      placeholder="debug"
                      checked
                      onChange={this.handleDebugChange}
                    />
                  ) : (
                    <FormControl
                      type="checkbox"
                      name="debug"
                      placeholder="debug"
                      onChange={this.handleDebugChange}
                    />
                  )}

              </td>
              <td>
                <ControlLabel>Mobile Presence CronJob</ControlLabel>
                <FormControl
                  type="text"
                  name="mobilePresenceJob"
                  placeholder="mobilePresenceJob"
                  value={serverSetting ? serverSetting.mobilePresenceJob : ''}
                  onChange={this.handleMobilePresenceJobChange}
                />
              </td>
              <td>
                <Button
                  bsStyle="primary"
                  onClick={() => this.saveHandle()}
                >
                  Save
                </Button>
              </td>
            </tr>
          </tbody>
        </Table>
      ));
    }
}
