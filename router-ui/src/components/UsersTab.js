import React from 'react';
import { inject, observer } from 'mobx-react';
import {
  Button, ControlLabel, FormControl, Table,
} from 'react-bootstrap';
import Loading from './Loading';

export default
@inject('usersStore', 'componentStateStore', 'devicesStore')
@observer
class UsersTab extends React.Component {
  componentDidMount() {
    if (!this.props.usersStore.isUsersLoading) {
      this.props.usersStore.load();
    }
  }

    deleteHandle = (userId) => {
      this.props.usersStore.deleteUser(userId);
    };

    addUserHandle = () => {
      this.props.usersStore.addUser();
    };

    unAssignHandle = (userId, mac) => {
      this.props.usersStore.unAssignMac(userId, mac);
    };

    handleChangeState = (event) => {
      this.props.usersStore.setFormData(event.target.name, event.target.value);
    };

  handleNewAppId = (event, value) => {
    this.props.usersStore.modifyAppId(
      value || event.target.value,
    );
  };

  handleNewSecret = (event, value) => {
    this.props.usersStore.modifySecret(
      value || event.target.value,
    );
  };

  onChange = (option) => {
    const shard = option.target.value;
    const userId = option.target.id;
    this.props.usersStore.assignShard(userId, shard);
  };

  render() {
    const {
      isUsersLoading, users,
    } = this.props.usersStore;
    const { smartappSetting } = this.props.componentStateStore;
    return (
      isUsersLoading ? <Loading /> : (
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <th>SmartThing device</th>
              <th>applicationId</th>
              <th>secret</th>
              <th>Shard</th>
              <th>Mac</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {
                    users.map((user) => {
                      const {
                        username, macs, label, shard, appId, secret,
                      } = user;
                      return (macs && macs.length > 0
                        ? macs.map((mac) => (
                          <tr key={`${username}|${mac}`}>
                            <td>{label}</td>
                            <td>{appId}</td>
                            <td>{secret}</td>
                            <td>
                              <select
                                id={`${username}|shard`}
                                name="shard"
                                onChange={this.onChange}
                              >
                                {!shard ? <option value="0" selected /> : null }
                                {smartappSetting.map(
                                  (smartappShard) => (shard && smartappShard === shard
                                    ? (
                                      <option
                                        value={shard}
                                        selected
                                      >
                                        {shard}
                                      </option>
                                    )
                                    : (
                                      <option
                                        value={shard}
                                      >
                                        {shard}
                                      </option>
                                    )),
                                ) }
                              </select>
                            </td>
                            <td key={username}>{mac}</td>
                            <td>
                              <Button
                                bsStyle="primary"
                                onClick={() => this.unAssignHandle(username, mac)}
                              >
                                UnAssign
                              </Button>
                            </td>
                          </tr>
                        )) : (
                          <tr key={username}>
                            <td>{label}</td>
                            <td>{appId}</td>
                            <td>{secret}</td>
                            <td>
                              <select
                                id={`${username}`}
                                name="shard"
                                onChange={this.onChange}
                              >
                                {!shard ? <option value="0" selected /> : null }
                                {smartappSetting.map(
                                  (smartappShard) => (shard && smartappShard === shard
                                    ? (
                                      <option
                                        value={smartappShard}
                                        selected
                                      >
                                        {smartappShard}
                                      </option>
                                    )
                                    : (
                                      <option
                                        value={smartappShard}
                                      >
                                        {smartappShard}
                                      </option>
                                    )),
                                ) }
                              </select>
                            </td>
                            <td />
                            <td>
                              <Button
                                bsStyle="primary"
                                onClick={() => this.deleteHandle(username)}
                              >
                                Delete Device
                              </Button>
                            </td>
                          </tr>
                        )
                      );
                    })
}
            <tr key="newUser">
              <td />
              <td>
                <ControlLabel>Application Id</ControlLabel>
                <FormControl
                  type="text"
                  name="newAppId"
                  placeholder="newAppId"
                  onChange={this.handleNewAppId}
                />
              </td>
              <td>
                <ControlLabel>Secret</ControlLabel>
                <FormControl
                  type="text"
                  name="newSecret"
                  placeholder="newSecret"
                  onChange={this.handleNewSecret}
                />
              </td>
              <td />
              <td />
              <td>
                <Button
                  bsStyle="primary"
                  onClick={() => this.addUserHandle()}
                >
                  Add Device
                </Button>
              </td>
            </tr>
          </tbody>
        </Table>
      )
    );
  }
}
