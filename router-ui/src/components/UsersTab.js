import React from 'react';
import { inject, observer } from 'mobx-react';
import Loading from "./Loading";
import {Button, FormControl, Table} from "react-bootstrap";

export default
@inject('usersStore')
@observer
class UsersTab extends React.Component {

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

    componentDidMount() {
        if (!this.props.usersStore.isUsersLoading) {
            this.props.usersStore.load();
        }
    }

    render() {
        const {
            isUsersLoading, users
        } = this.props.usersStore;
        return (
            isUsersLoading? <Loading /> : (<Table striped bordered condensed hover>
                <thead>
                <tr>
                    <th>username</th>
                    <th>Mac</th>
                    <th>Delete</th>
                </tr>
                </thead>
                <tbody>
                {
                    users.map((user) => {
                        const { username, macs } = user;
                        return ( macs && macs.length>0 ?
                            macs.map(mac =>
                                <tr key={username+'|'+mac}>
                                    <td>{username}</td>
                                    <td key={username}>{mac}</td>
                                    <td><Button
                                        bsStyle="primary"
                                        onClick={() => this.unAssignHandle(username, mac)}
                                    >
                                        UnAssign
                                    </Button></td>
                                </tr>
                            ):<tr key={username}>
                                    <td>{username}</td>
                                    <td></td>
                                    <td><Button
                                        bsStyle="primary"
                                        onClick={() => this.deleteHandle(username)}
                                    >
                                        Delete User
                                    </Button></td>
                                </tr>
                            );
                    })}

                <tr>
                    <td><FormControl
                        type="text"
                        name="newUserName"
                        placeholder="newUserName"
                        onChange={this.handleChangeState}
                    /></td>
                    <td></td>
                    <td><Button
                        bsStyle="primary"
                        onClick={() => this.addUserHandle()}

                    >
                        add User
                    </Button></td>
                </tr>
                </tbody>
            </Table>)
        );
    }
}
