import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import DeviceService from "../services/DeviceService";

class ListDeviceComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            devices: []
        };
    }

    addDevice() {
        this.props.history.push('/add-device');
    }

    editDevice(deviceId) {
        this.props.history.push(`/update-device/${deviceId}`);
    }

    deleteDevice(deviceId) {
        DeviceService.deleteDevice(deviceId).then(res => {
            this.setState({ devices: this.state.devices.filter(device => device.id !== deviceId) });
        });
    }

    viewDevice(deviceId) {
        this.props.history.push(`/view-device/${deviceId}`);
    }

    logout = () => {
        localStorage.removeItem('userRole');
        this.props.history.push('/user/login');
    };

    componentDidMount() {

        const userRole = localStorage.getItem('userRole');
        if (userRole !== 'admin') {
            this.props.history.push('/user/login');
            return;
        }


        DeviceService.getDevices().then(res => {
            this.setState({ devices: res.data });
        });
    }



    render() {
        return (
            <div className="container mt-4">
                <h2 className="text-center">Device List</h2>
                <div className="row mb-3">
                    <button onClick={() => this.addDevice()} className="btn btn-primary">
                        Add Device
                    </button>
                    <button onClick={this.logout} className="btn btn-danger ml-2">
                        Logout
                    </button>
                </div>
                <div className="row">
                    <table className="table table-striped table-bordered">
                        <thead>
                        <tr>
                            <th> Description</th>
                            <th> Address</th>
                            <th> Maximum Consumption</th>
                            <th> User Id</th>
                            <th> Actions </th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            this.state.devices.map(
                                device => (
                                    <tr key={device.id}>
                                        <td> {device.description}</td>
                                        <td> {device.address}</td>
                                        <td> {device.maxConsumption}</td>
                                        <td> {device.userId}</td>
                                        <td>
                                            <button onClick={() => this.editDevice(device.id)} className="btn btn-info">
                                                Update
                                            </button>
                                            <button style={{ marginLeft: "10px" }} onClick={() => this.deleteDevice(device.id)} className="btn btn-danger">
                                                Delete
                                            </button>
                                            <button style={{ marginLeft: "10px" }} onClick={() => this.viewDevice(device.id)} className="btn btn-info">
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                )
                            )
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default withRouter(ListDeviceComponent);
