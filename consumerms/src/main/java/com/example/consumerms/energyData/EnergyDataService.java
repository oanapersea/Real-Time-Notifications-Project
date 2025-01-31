package com.example.consumerms.energyData;

import java.util.List;

public interface EnergyDataService {

    void createEnergyData(EnergyDataMessage energyDataMessage);
    List<EnergyDataMessage> findAll();

}
