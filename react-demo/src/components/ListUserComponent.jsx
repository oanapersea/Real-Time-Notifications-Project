import React, { Component } from 'react';
import UserService from "../services/UserService";
import { Link, withRouter } from 'react-router-dom';

class ListUserComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: []
        };
    }

    addUser() {
        this.props.history.push('/add-user');
    }

    editUser(userid) {
        this.props.history.push(`/update-user/${userid}`);
    }

    viewUser(userid) {
        this.props.history.push(`/view-user/${userid}`);
    }

    deleteUser(userid) {
        UserService.deleteUser(userid).then(res => {
            this.setState({ users: this.state.users.filter(user => user.id !== userid) });
        });
    }

    logout = () => {
        localStorage.removeItem('userRole');
        localStorage.removeItem('authToken');
        this.props.history.push('/user/login');
    };

    componentDidMount() {
        const userRole = localStorage.getItem('userRole');
        if (userRole !== 'admin') {
            this.props.history.push('/user/login');
            return;
        }

        UserService.getUsers().then(res => {
            this.setState({ users: res.data });
        });
    }

    render() {
        return (
            <div className="container mt-4">
                <h2 className="text-center">Users List</h2>
                <div className="row mb-3">
                    <div className="col-12">
                        <button onClick={() => this.addUser()} className="btn btn-primary mr-2">
                            Add User
                        </button>
                        <button onClick={this.logout} className="btn btn-danger">
                            Logout
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <table className="table table-bordered">
                            <thead>
                            <tr>
                                <th>User Name</th>
                                <th>User Role</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.role}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <button onClick={() => this.editUser(user.id)} className="btn btn-info mr-2">
                                            Update
                                        </button>
                                        <button
                                            onClick={() => this.deleteUser(user.id)}
                                            className="btn btn-danger mr-2"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => this.viewUser(user.id)}
                                            className="btn btn-info"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(ListUserComponent);
