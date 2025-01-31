package com.example.devicems.device.impl;

import com.example.devicems.device.Device;
import com.example.devicems.device.DeviceRepository;
import com.example.devicems.device.DeviceService;
import com.example.devicems.device.external.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Optional;

@Service
public class DeviceServiceImpl implements DeviceService {
    private final DeviceRepository deviceRepository;
//    private final RestTemplate restTemplate;

//    private final String USER_SERVICE_URL = "http://localhost:8081/user";


    public DeviceServiceImpl(DeviceRepository deviceRepository) {
        this.deviceRepository=deviceRepository;

    }
    @Override
    public List<Device> findAll() {
        return deviceRepository.findAll();
    }

    @Override
    public List<Device> findDevicesByUserId(Long userId) {
        return deviceRepository.findByUserId(userId);
    }


    @Override
    public void createDevice(Device device) {

        deviceRepository.save(device);
    }

    @Override
    public Device getDeviceById(Long id) {
        return deviceRepository.findById(id).orElse(null);
    }

    @Override
    public boolean updateDevice(Long id, Device updatedDevice) {
        Optional<Device> deviceOptional = deviceRepository.findById(id);
        if(deviceOptional.isPresent()) {
            Device device = deviceOptional.get();
            device.setAddress(updatedDevice.getAddress());
            device.setDescription(updatedDevice.getDescription());
            device.setMaxConsumption(updatedDevice.getMaxConsumption());
            device.setUserId(updatedDevice.getUserId());
            deviceRepository.save(device);
            return true;
        }
        return false;
    }

    @Override
    public boolean deleteDeviceById(Long id) {
        try{
            deviceRepository.deleteById(id);
            return true;
        }catch(Exception E) {
            return false;
        }
    }

    @Override
    public String getMaxConsumption(Long deviceId) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new IllegalArgumentException("Device not found"));
        return device.getMaxConsumption();  // Return only the maxConsumption property
    }
}
