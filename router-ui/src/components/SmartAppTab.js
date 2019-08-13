import React from 'react';
import { inject, observer } from 'mobx-react';
import {
  Button, ControlLabel, FormControl, Table,
} from 'react-bootstrap';
import Loading from './Loading';

export default
@inject('componentStateStore')
@observer
class SmartAppTab extends React.Component {
  componentDidMount() {
    if (!this.props.componentStateStore.isSettingLoading) {
      this.props.componentStateStore.settingLoad();
    }
  }

    handleUrlChange = (event, value) => {
      this.props.componentStateStore.setSmartAppData('smartThingsUrl', value);
    };

    handleAppIdChange = (event, value) => {
      this.props.componentStateStore.setSmartAppData('appId', value);
    };

    handleAccessTokenChange = (event, value) => {
      this.props.componentStateStore.setSmartAppData('accessToken', value);
    };

    saveHandle = () => {
      this.props.componentStateStore.smartAppSave();
    };

    render() {
      const {
        smartappSetting, isSettingLoading,
      } = this.props.componentStateStore;
      return (isSettingLoading ? <Loading /> : (
        <Table striped bordered condensed hover>
          <thead />
          <tbody>
            <tr>
              <ControlLabel>SmartApp Url</ControlLabel>
              <FormControl
                type="text"
                name="smartThingsUrl"
                placeholder="smartThingsUrl"
                value={smartappSetting ? smartappSetting.smartThingsUrl : ''}
                onChange={this.handleUrlChange}
              />
            </tr>
            <tr>
              <ControlLabel>SmartApp Application Id</ControlLabel>
              <FormControl
                type="text"
                name="appId"
                placeholder="appId"
                value={smartappSetting ? smartappSetting.appId : ''}
                onChange={this.handleAppIdChange}
              />
            </tr>
            <tr>
              <ControlLabel>SmartApp Access Token</ControlLabel>
              <FormControl
                type="text"
                name="accessToken"
                placeholder="accessToken"
                value={smartappSetting ? smartappSetting.accessToken : ''}
                onChange={this.handleAccessTokenChange}
              />
            </tr>
            <tr>
              <Button
                bsStyle="primary"
                onClick={() => this.saveHandle()}
              >
                        Save
              </Button>
            </tr>
          </tbody>
        </Table>
      ));
    }
}
