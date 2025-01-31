package com.example.consumerms.energyData;

import com.example.consumerms.energyData.EnergyDataMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface EnergyDataRepository extends JpaRepository<EnergyDataMessage, Long> {
}
