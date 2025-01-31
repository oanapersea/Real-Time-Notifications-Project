package com.example.consumerms.hourlyConsumption.impl;

import com.example.consumerms.hourlyConsumption.HourlyConsumption;
import com.example.consumerms.hourlyConsumption.HourlyConsumptionRepository;
import com.example.consumerms.hourlyConsumption.HourlyConsumptionService;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class HourlyConsumptionServiceImpl implements HourlyConsumptionService {

    private HourlyConsumptionRepository hourlyConsumptionRepository;
    private final RestTemplate restTemplate;
    private static final String DEVICE_MAX_CONSUMPTION_URL = "http://device-service:8080/device/{deviceId}/maxConsumption";


    public HourlyConsumptionServiceImpl(HourlyConsumptionRepository hourlyConsumptionRepository, RestTemplate restTemplate) {
        this.hourlyConsumptionRepository = hourlyConsumptionRepository;
        this.restTemplate = restTemplate;
    }

    @Override
    public void createHourlyConsumption(HourlyConsumption hourlyConsumption) {
        hourlyConsumptionRepository.save(hourlyConsumption);
    }

    @Override
    public List<HourlyConsumption> findAll() {
        return hourlyConsumptionRepository.findAll();
    }

    @Override
    public double getMaxConsumption(String deviceId) {
        String constructedUrl = String.format(DEVICE_MAX_CONSUMPTION_URL, deviceId);
        System.out.println("Constructed URL: " + constructedUrl);
        String maxConsumptionStr = restTemplate.getForObject(DEVICE_MAX_CONSUMPTION_URL, String.class, deviceId);
        System.out.println(maxConsumptionStr);
        try {
            return Double.parseDouble(maxConsumptionStr);
        } catch (NumberFormatException e) {
            return 0;
        }
    }

}
