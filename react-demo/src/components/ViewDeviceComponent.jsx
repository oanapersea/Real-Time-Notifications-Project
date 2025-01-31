import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import DeviceService from "../services/DeviceService";
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

class ViewDeviceComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.match.params.id,
            device: {},
            notifications: {}
        };


        this.stompClient = null;
    }

    componentDidMount() {
        DeviceService.getDeviceById(this.state.id).then(res => {
            this.setState({device: res.data});
        });

        this.initializeWebSocketConnection();
    }

    componentWillUnmount() {
        if (this.stompClient) {
            this.stompClient.deactivate();
        }
    }

    initializeWebSocketConnection = () => {
        if (this.stompClient) {
            console.log('WebSocket client already initialized');
            return;
        }

        console.log('Initializing WebSocket connections');

        const socket1 = new SockJS('http://localhost:8082/ws');
        const stompClient1 = new Client({
            webSocketFactory: () => socket1,
            debug: (str) => console.log(str),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        stompClient1.onConnect = () => {
            console.log('Connected to WebSocket (8082)');
            stompClient1.subscribe(`/topic/notifications`, (message) => {
                console.log("Received notification from 8082: ", message.body);
                if (message.body) {
                    const notification = JSON.parse(message.body);
                    this.addNotification(notification);
                }
            });
        };

        stompClient1.onStompError = (frame) => {
            console.error('STOMP error (8082)', frame.headers['message'], frame.body);
        };

        const socket2 = new SockJS('http://localhost:8083/ws');
        const stompClient2 = new Client({
            webSocketFactory: () => socket2,
            debug: (str) => console.log(str),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        stompClient2.onConnect = () => {
            console.log('Connected to WebSocket (8083)');
            stompClient2.subscribe(`/topic/notifications`, (message) => {
                console.log("Received notification from 8083: ", message.body);
                if (message.body) {
                    const notification = JSON.parse(message.body);
                    this.addNotification(notification);
                }
            });
        };

        stompClient2.onStompError = (frame) => {
            console.error('STOMP error (8083)', frame.headers['message'], frame.body);
        };

        stompClient1.activate();
        stompClient2.activate();

    };


    addNotification = (notification) => {
        this.setState((prevState) => {
            const updatedNotifications = {...prevState.notifications};

            if (updatedNotifications[notification.deviceId]) {
                updatedNotifications[notification.deviceId] = notification;
            } else {
                updatedNotifications[notification.deviceId] = notification;
            }

            return {notifications: updatedNotifications};
        });
    };


    render() {
        const {device, notifications} = this.state;
        const notification = notifications[device.id];

        return (
            <div className="container mt-4">
                <div className="card col-md-6 offset-md-3"></div>
                <h3 className="text-center"> View Device Details</h3>
                <div className="card-body">
                    <div className="row">
                        <label> Description: </label>
                        <div> {device.description} </div>
                    </div>
                    <div className="row">
                        <label> Address: </label>
                        <div> {device.address} </div>
                    </div>
                    <div className="row">
                        <label> MaxConsumption: </label>
                        <div> {device.maxConsumption} </div>
                    </div>
                    <div className="row">
                        <label> User ID: </label>
                        <div> {device.userId} </div>
                    </div>
                </div>

                <div className="mt-4">
                    <h4>Notifications</h4>
                    <ul className="list-group">
                        {notification ? (
                            <li className="list-group-item">
                                {notification.message} (Time: {new Date(notification.timestamp).toLocaleString()})
                            </li>
                        ) : (
                            <li className="list-group-item">No notifications yet</li>
                        )}
                    </ul>
                </div>
            </div>
        );
    }
}

export default withRouter(ViewDeviceComponent);
