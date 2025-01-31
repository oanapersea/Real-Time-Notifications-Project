import React from 'react';
import { useNavigate } from 'react-router-dom';
import ListDeviceComponent from './ListDeviceComponent';

const DeviceManagement = () => {
    const navigate = useNavigate();

    return <ListDeviceComponent navigate={navigate} />;
};

export default DeviceManagement;
