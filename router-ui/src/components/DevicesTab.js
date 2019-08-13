import React from 'react';
import { inject, observer } from 'mobx-react';
import { Table } from 'react-bootstrap';
import Loading from './Loading';

export default
@inject('devicesStore', 'usersStore')
@observer
class DevicesTab extends React.Component {
  componentDidMount() {
    if (!this.props.devicesStore.isDevicesLoading) {
      this.props.devicesStore.load();
    }
  }

    onChange = (option) => {
      const username = option.target.value;
      const mac = option.target.id;
      this.props.usersStore.assignMac(username, mac);
    };

    render() {
      const {
        devices, maclist, isDevicesLoading,
      } = this.props.devicesStore;
      const {
        users,
      } = this.props.usersStore;
      const userList = [];
      const macUserList = {};
      if (users) {
        users.forEach((user) => {
          userList.push(user.username);
          user.macs.forEach((mac) => {
            macUserList[mac] = user;
          });
        });
      }

      return (
        isDevicesLoading ? <Loading /> : (
          <Table striped bordered condensed hover>
            <thead>
              <tr>
                <th>name</th>
                <th>nickName</th>
                <th>vendor</th>
                <th>mac</th>
                <th>status</th>
                <th>user</th>
              </tr>
            </thead>
            <tbody>
              {
                        devices.map((device) => {
                          const {
                            nickName, name, vendor, mac,
                          } = device;
                          const userAssigned = macUserList[mac];
                          return (
                            <tr key={mac}>
                              <td>{name}</td>
                              <td>{nickName}</td>
                              <td>{vendor}</td>
                              <td>{mac}</td>
                              <td>{maclist.includes(mac) ? 'online' : 'offline'}</td>
                              <td>
                                <select
                                  id={mac}
                                  name="user"
                                  onChange={this.onChange}
                                >
                                  {!userAssigned ? <option value="0" selected /> : null }
                                  {userList.map(
                                    username => (
                                      userAssigned && username === userAssigned.username
                                        ? <option value={username} selected>{username}</option>
                                        : <option value={username}>{username}</option>),
                                  )}
                                </select>
                              </td>
                            </tr>
                          );
                        })
                        }
            </tbody>
          </Table>
        )
      );
    }
}
