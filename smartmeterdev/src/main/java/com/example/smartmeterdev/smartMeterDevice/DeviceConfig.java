package com.example.smartmeterdev.smartMeterDevice;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class DeviceConfig {

    @Value("${device.id}")
    private String deviceId;

    @Value("${SENSOR_FILE_PATH}")
    private String sensorFilePath;

    public String getDeviceId() {
        return deviceId;
    }

    public String getSensorFilePath() {
        return sensorFilePath;
    }
}
