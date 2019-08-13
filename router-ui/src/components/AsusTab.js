import React from 'react';
import { inject, observer } from 'mobx-react';
import {
  Button, ControlLabel, FormControl, Table,
} from 'react-bootstrap';
import Loading from './Loading';

export default
@inject('componentStateStore')
@observer
class AsusTab extends React.Component {
  componentDidMount() {
    if (!this.props.componentStateStore.isSettingLoading) {
      this.props.componentStateStore.settingLoad();
    }
  }

    handleIpChange = (event, value) => {
      this.props.componentStateStore.setAsusSetting('routerIp', value);
    };

    handlePortChange = (event, value) => {
      this.props.componentStateStore.setAsusSetting('routerPort', value);
    };

    handleUserNameChange = (event, value) => {
      this.props.componentStateStore.setAsusSetting('userName', value);
    };

    handlePasswordChange = (event, value) => {
      this.props.componentStateStore.setAsusSetting('password', value);
    };

    saveHandle = () => {
      this.props.componentStateStore.smartAppSave();
    };

    render() {
      const {
        asusSetting, isSettingLoading,
      } = this.props.componentStateStore;
      return (isSettingLoading ? <Loading /> : (
        <Table striped bordered condensed hover>
          <thead />
          <tbody>
            <tr>
              <ControlLabel>Asus Router IP</ControlLabel>
              <FormControl
                type="text"
                name="routerIp"
                placeholder="routerIp"
                value={asusSetting ? asusSetting.routerIp : ''}
                onChange={this.handleIpChange}
              />
            </tr>
            <tr>
              <ControlLabel>Asus Router Port</ControlLabel>
              <FormControl
                type="number"
                name="routerPort"
                placeholder="routerPort"
                value={asusSetting ? asusSetting.routerPort : ''}
                onChange={this.handlePortChange}
              />
            </tr>
            <tr>
              <ControlLabel>Router UserName</ControlLabel>
              <FormControl
                type="text"
                name="userName"
                placeholder="userName"
                value={asusSetting ? asusSetting.userName : ''}
                onChange={this.handleUserNameChange}
              />
            </tr>
            <tr>
              <ControlLabel>Router Password</ControlLabel>
              <FormControl
                type="password"
                name="password"
                placeholder="password"
                value={asusSetting ? asusSetting.password : ''}
                onChange={this.handlePasswordChange}
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
