package com.example.devicems.device;

import java.util.List;

public interface DeviceService {

    List<Device> findAll();
    void createDevice(Device device);
    Device getDeviceById(Long id);
    boolean updateDevice(Long id, Device device);
    boolean deleteDeviceById(Long id);

    List<Device> findDevicesByUserId(Long userId);

    public String getMaxConsumption(Long deviceId);

}
