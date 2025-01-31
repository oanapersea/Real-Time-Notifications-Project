package com.example.smartmeterdev.messaging;

import com.example.smartmeterdev.smartMeterDevice.EnergyDataMessage;
import com.example.smartmeterdev.smartMeterDevice.SensorDataReader;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
public class EnergyDataMessageProducer {

    private final RabbitTemplate rabbitTemplate;
    private final SensorDataReader sensorDataReader;
    private List<Double> sensorData;
    private Long deviceId;
    private TaskScheduler taskScheduler;

    public EnergyDataMessageProducer(RabbitTemplate rabbitTemplate, SensorDataReader sensorDataReader, TaskScheduler taskScheduler) {
        this.rabbitTemplate = rabbitTemplate;
        this.sensorDataReader = sensorDataReader;
        this.taskScheduler = taskScheduler;
    }

    public void startSendingMessages(String filePath, Long deviceId) {
        this.sensorData = sensorDataReader.readSensorData(filePath);

        if (sensorData.isEmpty()) {
            System.err.println("No sensor data available to send.");
            return;
        }

        Runnable sendDataTask = new Runnable() {
            private int dataIndex = 0;

            @Override
            public void run() {
                if (dataIndex < sensorData.size()) {
                    double measurementValue = sensorData.get(dataIndex);
                    try {
                        EnergyDataMessage message = new EnergyDataMessage();
                        message.setDevice_id(deviceId);
                        message.setTimestamp(System.currentTimeMillis());
                        message.setMeasurementValue(measurementValue);

                        rabbitTemplate.convertAndSend("energyDataQueue", message);
                        System.out.println("Sent message: " + message);

                        dataIndex++;
                    } catch (Exception e) {
                        System.err.println("Error sending message: " + e.getMessage());
                    }
                } else {
                    System.out.println("No more data to send. Stopping task.");
                    taskScheduler.stopScheduler();
                }
            }
        };

        taskScheduler.startSendingWithPause(sendDataTask, 80 * 1000, 2 * 60 * 1000);
    }

}
