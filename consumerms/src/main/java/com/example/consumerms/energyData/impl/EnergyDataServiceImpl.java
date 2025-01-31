package com.example.consumerms.energyData.impl;

import com.example.consumerms.energyData.EnergyDataRepository;
import com.example.consumerms.energyData.EnergyDataService;
import com.example.consumerms.energyData.EnergyDataMessage;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EnergyDataServiceImpl implements EnergyDataService {

    private EnergyDataRepository energyDataRepository;

    public EnergyDataServiceImpl(EnergyDataRepository energyDataRepository) {
        this.energyDataRepository = energyDataRepository;
    }

    @Override
    public List<EnergyDataMessage> findAll() {
        return energyDataRepository.findAll();
    }

    @Override
    public void createEnergyData(EnergyDataMessage energyDataMessage) {
        energyDataRepository.save(energyDataMessage);
    }


}
