import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import DeviceService from "../services/DeviceService";

class CreateDeviceComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            description: '',
            address: '',
            maxConsumption: '',
            userId: '',
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.changeDescriptionHandler = this.changeDescriptionHandler.bind(this);
        this.changeUserIdHandler = this.changeUserIdHandler.bind(this);
        this.changeAddressHandler = this.changeAddressHandler.bind(this);
        this.changeMaxConsumptionHandler = this.changeMaxConsumptionHandler.bind(this);
    }

    async onSubmit(e) {
        e.preventDefault();
        const device = {
            description: this.state.description,
            address: this.state.address,
            id: this.state.id,
            maxConsumption: this.state.maxConsumption,
            userId: this.state.userId
        };

        console.log('Submitting device:', device);
        try {
            const response = await DeviceService.createDevice(device);
            console.log('Device created response:', response.data);
            this.props.history.push("/device", { deviceCreated: true });
        } catch (error) {
            console.error("Error creating device:", error);
        }
    }

    changeDescriptionHandler(event) {
        this.setState({ description: event.target.value });
    }

    changeAddressHandler(event) {
        this.setState({ address: event.target.value });
    }

    changeMaxConsumptionHandler(event) {
        this.setState({ maxConsumption: event.target.value });
    }

    changeUserIdHandler(event) {
        this.setState({ userId: event.target.value });
    }

    componentDidMount() {
        const userRole = localStorage.getItem('userRole');

        if (userRole !== 'admin') {
            this.props.history.push('/user/login');
            return;
        }
    }


    render() {
        return (
            <div>
                <div className="container">
                    <div className="row">
                        <div className="card col-md-6 offset-md-3 offset-md-3">
                            <h3 className="text-center">Add Device</h3>
                            <div className="card-body">
                                <form onSubmit={this.onSubmit}>
                                    <div className="form-group">
                                        <label> Description: </label>
                                        <input
                                            placeholder="Description"
                                            name="description"
                                            className="form-control"
                                            value={this.state.description}
                                            onChange={this.changeDescriptionHandler}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label> Address: </label>
                                        <input
                                            placeholder="Address"
                                            name="address"
                                            className="form-control"
                                            value={this.state.address}
                                            onChange={this.changeAddressHandler}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label> Maximum Consumption: </label>
                                        <input
                                            placeholder="Maximum  Consumption"
                                            name="maxConsumption"
                                            className="form-control"
                                            value={this.state.maxConsumption}
                                            onChange={this.changeMaxConsumptionHandler}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label> User ID: </label>
                                        <input
                                            placeholder="User ID"
                                            name="userId"
                                            className="form-control"
                                            value={this.state.userId}
                                            onChange={this.changeUserIdHandler}
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-success">Submit</button>
                                    <Link className="btn btn-danger" to="/device"
                                          style={{marginLeft: "10px"}}>Cancel</Link>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(CreateDeviceComponent);
