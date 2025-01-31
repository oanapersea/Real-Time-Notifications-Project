package com.example.consumerms.hourlyConsumption;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
public class HourlyConsumption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "deviceId", nullable = false)
    private String deviceId;

    @Column(name = "hour", nullable = false)
    private LocalDateTime hour;

    @Column(name = "consumption", nullable = false)
    private double totalConsumption;

    public HourlyConsumption(){

    }

    public HourlyConsumption(Long id, String deviceId, LocalDateTime hour, double totalConsumption) {
        this.id = id;
        this.deviceId = deviceId;
        this.hour = hour;
        this.totalConsumption = totalConsumption;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public LocalDateTime getHour() {
        return hour;
    }

    public void setHour(LocalDateTime hour) {
        this.hour = hour;
    }

    public double getTotalConsumption() {
        return totalConsumption;
    }

    public void setTotalConsumption(double totalConsumption) {
        this.totalConsumption = totalConsumption;
    }
}
