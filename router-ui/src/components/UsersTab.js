import React from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Table } from 'react-bootstrap';
import Loading from './Loading';

export default
@inject('usersStore')
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

    render() {
      const {
        isUsersLoading, users,
      } = this.props.usersStore;
      return (
        isUsersLoading ? <Loading /> : (
          <Table striped bordered condensed hover>
            <thead>
              <tr>
                <th>SmartThing device</th>
                <th>Mac</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {
                    users.map((user) => {
                      const { username, macs, label } = user;
                      return (macs && macs.length > 0
                        ? macs.map(mac => (
                          <tr key={`${username}|${mac}`}>
                            <td>{label}</td>
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
