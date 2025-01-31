package com.example.consumerms.messaging;

import com.example.consumerms.energyData.EnergyDataMessage;
import com.example.consumerms.energyData.EnergyDataService;
import com.example.consumerms.hourlyConsumption.HourlyConsumption;
import com.example.consumerms.hourlyConsumption.HourlyConsumptionService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Timer;
import java.util.TimerTask;

import org.springframework.messaging.simp.SimpMessagingTemplate;

@Component
public class EnergyDataMessageConsumer {

    private final EnergyDataService energyDataService;
    private final HourlyConsumptionService hourlyConsumptionService;
    private final SimpMessagingTemplate messagingTemplate;
    private long lastReceivedTimestamp = 0;
    private Timer inactivityTimer;
    private static final long TIMEOUT = 2 * 60 * 1000;
    private double totalConsumption;
    private double maxConsumption;
    private String deviceId;

    public EnergyDataMessageConsumer(EnergyDataService energyDataService,
                                     HourlyConsumptionService hourlyConsumptionService,
                                     SimpMessagingTemplate messagingTemplate) {
        this.energyDataService = energyDataService;
        this.hourlyConsumptionService = hourlyConsumptionService;
        this.messagingTemplate = messagingTemplate;
    }

    @RabbitListener(queues = "energyDataQueue")
    public void consumeMessage(EnergyDataMessage energyDataMessage) {

        deviceId = String.valueOf(energyDataMessage.getDevice_id());
        lastReceivedTimestamp = System.currentTimeMillis();
        totalConsumption += energyDataMessage.getMeasurementValue();
        maxConsumption = hourlyConsumptionService.getMaxConsumption(deviceId);

        System.out.println("Received message: " + energyDataMessage.getMeasurementValue());
        System.out.println("Total value is: " + totalConsumption);

        energyDataService.createEnergyData(energyDataMessage);

        if (totalConsumption > maxConsumption) {
            NotificationDTO notification = new NotificationDTO();
            notification.setDeviceId(deviceId);
            notification.setMessage(String.format(
                    "Device %s exceeded the maximum consumption limit. Current: %.2f, Max: %.2f",
                    deviceId, totalConsumption, maxConsumption));
            notification.setTimestamp(System.currentTimeMillis());

            messagingTemplate.convertAndSend("/topic/notifications/" + deviceId, notification);
        }

        resetInactivityTimer();
    }

    private void startInactivityTimer() {
        inactivityTimer = new Timer();
        inactivityTimer.schedule(new TimerTask() {
            @Override
            public void run() {
                long currentTime = System.currentTimeMillis();
                if (currentTime - lastReceivedTimestamp >= 15 * 1000) {
                    if (deviceId == null || totalConsumption == 0) return;

                    HourlyConsumption hourlyConsumption = new HourlyConsumption();
                    hourlyConsumption.setDeviceId(deviceId);
                    hourlyConsumption.setHour(LocalDateTime.now());
                    hourlyConsumption.setTotalConsumption(totalConsumption);

                    hourlyConsumptionService.createHourlyConsumption(hourlyConsumption);
                }
            }
        }, 15 * 1000, TIMEOUT);
    }

    private void resetInactivityTimer() {
        if (inactivityTimer != null) inactivityTimer.cancel();
        startInactivityTimer();
    }
}
