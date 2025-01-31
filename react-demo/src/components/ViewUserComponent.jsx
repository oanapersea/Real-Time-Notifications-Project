import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import UserService from "../services/UserService";
import DeviceService from "../services/DeviceService";

class ViewUserComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            id: this.props.match.params.id,
            user: {},
            devices: []
        }
    }

    componentDidMount() {
        UserService.getUserById(this.state.id).then(res => {
            this.setState({ user: res.data });
        });

        // DeviceService.getDevicesByUserId(this.state.id).then(res => {
        //     this.setState({ devices: res.data });
        // });
    }

    chatWithAdmin = () => {
        if (this.state.user && this.state.user.id) {
            if (this.state.user.role === 'admin') {
                this.props.history.push(`/chats`);
            } else {
                this.props.history.push(`/chat/${this.state.user.id}`);
            }
        } else {
            console.error("User data is not loaded yet.");
        }
    };

    render() {
        return (
            <div className="container mt-4">
                <div className="card col-md-6 offset-md-3">
                    <h3 className="text-center">Your Details</h3>
                    <div className="card-body">
                        <div className="row">
                            <label>User Name:</label>
                            <div>{this.state.user.name}</div>
                        </div>
                        <div className="row">
                            <label>Role:</label>
                            <div>{this.state.user.role}</div>
                        </div>
                        <div className="row">
                            <label>Email:</label>
                            <div>{this.state.user.email}</div>
                        </div>
                        <div className="row">
                            <label>Password:</label>
                            <div>{this.state.user.password}</div>
                        </div>

                        {/* Render devices */}
                        <h4 className="text-center">Devices</h4>
                        <table className="table table-striped">
                            <thead>
                            <tr>
                                <th>Description</th>
                                <th>Address</th>
                                <th>Max Consumption</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.devices.length > 0 ? (
                                this.state.devices.map(device => (
                                    <tr key={device.id}>
                                        <td>{device.description}</td>
                                        <td>{device.address}</td>
                                        <td>{device.maxConsumption}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center">
                                        No devices found for this user.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>


                        <div className="text-center mt-3">
                            <button
                                onClick={this.chatWithAdmin}
                                className="btn btn-success"
                                disabled={!this.state.user || !this.state.user.id}
                            >
                                {this.state.user.role === 'admin' ? 'Go to chats' : 'Chat with Admin'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(ViewUserComponent);
