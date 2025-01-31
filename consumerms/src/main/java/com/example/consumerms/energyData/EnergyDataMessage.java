package com.example.consumerms.energyData;

import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;

import java.util.UUID;

@Entity
public class EnergyDataMessage {

    @Id
    @Column(name = "device_id", updatable = false, nullable = false)
    private Long device_id;
    @Column(name = "measurement_value", nullable = false)
    private Long timestamp;
    @Column(name = "timestamp")
    private double measurementValue;

    public EnergyDataMessage(){

    }

    public EnergyDataMessage(Long device_id, Long timestamp, double measurementValue){
        this.device_id = device_id;
        this.timestamp = timestamp;
        this.measurementValue = measurementValue;
    }

    public Long getDevice_id() {
        return device_id;
    }

    public void setDevice_id(Long device_id) {
        this.device_id = device_id;
    }

    public Long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }

    public double getMeasurementValue() {
        return measurementValue;
    }

    public void setMeasurementValue(double measurementValue) {
        this.measurementValue = measurementValue;
    }
}
