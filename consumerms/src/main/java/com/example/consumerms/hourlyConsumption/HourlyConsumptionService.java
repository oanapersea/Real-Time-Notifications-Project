package com.example.consumerms.hourlyConsumption;

import com.example.consumerms.energyData.EnergyDataMessage;

import java.util.List;

public interface HourlyConsumptionService {

    void createHourlyConsumption(HourlyConsumption hourlyConsumption);
    List<HourlyConsumption> findAll();
    double getMaxConsumption(String deviceId);


}
