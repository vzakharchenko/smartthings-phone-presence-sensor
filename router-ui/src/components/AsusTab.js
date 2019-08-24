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
      this.props.componentStateStore.setAsusSetting('routerIp', value || event.target.value);
    };

    handlePortChange = (event, value) => {
      this.props.componentStateStore.setAsusSetting('routerPort', value || event.target.value);
    };

    handleUserNameChange = (event, value) => {
      this.props.componentStateStore.setAsusSetting('userName', value || event.target.value);
    };

    handlePasswordChange = (event, value) => {
      this.props.componentStateStore.setAsusSetting('password', value || event.target.value);
    };

    handleRouterTypeChange = (event) => {
      const type = event.target.value;
      this.props.componentStateStore.setAsusSetting('router', type);
    };

    saveHandle = () => {
      this.props.componentStateStore.asusSave();
    };

    render() {
      const {
        asusSetting, isSettingLoading, asus, tpLink, mikrotik,
      } = this.props.componentStateStore;
      return (isSettingLoading ? <Loading /> : (
        <Table striped bordered condensed hover>
          <thead />
          <tbody>
            <tr>
              <ControlLabel>Router Type</ControlLabel>
              <div style={{ width: 'auto' }}>
                <select
                  id="router"
                  name="router"
                  onChange={this.handleRouterTypeChange}
                  style={{ width: '300px' }}
                >
                  {!asus && !tpLink && !mikrotik ? <option value="0" selected /> : null }
                  { asus ? <option id="asus" value="asus" selected>Asus</option> : <option id="asus" value="asus">Asus</option> }
                  { tpLink ? <option id="tplink" value="tplink" selected>TpLink</option> : <option id="tplink" value="tplink">TpLink</option> }
                  { mikrotik ? <option id="mikrotik" value="mikrotik" selected>Mikrotik</option> : <option id="mikrotik" value="mikrotik">Mikrotik</option> }
                </select>
              </div>
            </tr>
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
