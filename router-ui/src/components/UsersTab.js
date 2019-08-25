import React from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Table } from 'react-bootstrap';
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

  blockAccess = (event) => {
    this.props.devicesStore.blockAccess(event.target.id);
  };

  unBlockAccess = (event) => {
    this.props.devicesStore.unBlockAccess(event.target.id);
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
    const {
      blockedMacs,
    } = this.props.devicesStore;
    return (
      isUsersLoading ? <Loading /> : (
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <th>SmartThing device</th>
              <th>Shard</th>
              <th>Mac</th>
              <th>Internet</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {
                    users.map((user) => {
                      const {
                        username, macs, label, shard,
                      } = user;
                      return (macs && macs.length > 0
                        ? macs.map(mac => (
                          <tr key={`${username}|${mac}`}>
                            <td>{label}</td>
                            <td>
                              <select
                                id={`${username}|shard`}
                                name="shard"
                                onChange={this.onChange}
                              >
                                {!shard ? <option value="0" selected /> : null }
                                {smartappSetting.map(
                                  smartappShard => (shard && smartappShard === shard
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
                            <td id={mac} key={`internet_${username}|${mac}`}>
                              {(blockedMacs.includes(mac)) ? (
                                <Button
                                  id={mac}
                                  bsStyle="primary"
                                  onClick={event => this.unBlockAccess(event)}
                                >
                                unLock Internet
                                </Button>
                              )
                                : (
                                  <Button
                                    id={mac}
                                    bsStyle="primary"
                                    onClick={event => this.blockAccess(event)}
                                  >
                                Block Access
                                  </Button>
                                )}
                            </td>
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
                            <td>
                              <select
                                id={`${username}`}
                                name="shard"
                                onChange={this.onChange}
                              >
                                {!shard ? <option value="0" selected /> : null }
                                {smartappSetting.map(
                                  smartappShard => (shard && smartappShard === shard
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
                    })}
          </tbody>
        </Table>
      )
    );
  }
}
