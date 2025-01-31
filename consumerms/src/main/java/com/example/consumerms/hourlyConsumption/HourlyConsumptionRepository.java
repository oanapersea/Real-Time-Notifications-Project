package com.example.consumerms.hourlyConsumption;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface HourlyConsumptionRepository extends JpaRepository<HourlyConsumption, Long> {

}
