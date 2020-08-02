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

  addShard = () => {
    this.props.componentStateStore.addShard();
  };

  handleUrlChange = (event, value) => {
    this.props.componentStateStore.modifyShard(
      value || event.target.value,
    );
  };

    saveHandle = () => {
      this.props.componentStateStore.smartAppSave();
    };

    render() {
      const {
        smartappSetting, isSettingLoading,
      } = this.props.componentStateStore;
      return (isSettingLoading || !smartappSetting ? <Loading /> : (
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <th>Location Url</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {
              smartappSetting.map((shard) => (
                <tr key={shard}>
                  <td>{shard}</td>
                  <td />
                  <td />
                </tr>
              ))
}
            <tr key="newShard">
              <td>
                <ControlLabel>SmartApp Url</ControlLabel>
                <FormControl
                  type="text"
                  name="smartThingsUrl"
                  placeholder="smartThingsUrl"
                  onChange={this.handleUrlChange}
                />
              </td>
              <td />
              <td>
                <Button
                  bsStyle="primary"
                  onClick={() => this.addShard()}
                >
                  Add Shard
                </Button>
              </td>
            </tr>
          </tbody>
        </Table>
      ));
    }
}
