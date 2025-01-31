package com.example.smartmeterdev;

import com.example.smartmeterdev.smartMeterDevice.DeviceConfig;
import com.example.smartmeterdev.smartMeterDevice.SensorDataReader;
import com.example.smartmeterdev.messaging.EnergyDataMessageProducer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;

import java.util.List;
import java.util.UUID;

@SpringBootApplication
public class SmartmeterdevApplication {

	private final EnergyDataMessageProducer energyDataMessageProducer;

	public SmartmeterdevApplication(EnergyDataMessageProducer energyDataMessageProducer) {
		this.energyDataMessageProducer = energyDataMessageProducer;
	}

	@Bean
	public CommandLineRunner commandLineRunner(SensorDataReader sensorDataReader, DeviceConfig deviceConfig) {
		return args -> {
			String deviceId = deviceConfig.getDeviceId();
			String sensorFilePath = deviceConfig.getSensorFilePath();
			if (sensorFilePath != null) {
				energyDataMessageProducer.startSendingMessages(sensorFilePath, Long.valueOf(deviceId));
			} else {
				System.out.println("Error: SENSOR_FILE_PATH environment variable is not set.");
			}
		};
	}

	public static void main(String[] args) {
		SpringApplication.run(SmartmeterdevApplication.class, args);
	}
}
