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
      this.props.componentStateStore.setSmartAppData('smartThingsUrl',
        value || event.target.value);
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
