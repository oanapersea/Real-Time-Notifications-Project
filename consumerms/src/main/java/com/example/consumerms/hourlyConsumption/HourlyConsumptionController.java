package com.example.consumerms.hourlyConsumption;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/consumption")
public class HourlyConsumptionController {

    private HourlyConsumptionService hourlyConsumptionService;
    public HourlyConsumptionController(HourlyConsumptionService hourlyConsumptionService) {
        this.hourlyConsumptionService = hourlyConsumptionService;
    }

    @GetMapping
    public ResponseEntity<List<HourlyConsumption>> findAll() {
        return ResponseEntity.ok(hourlyConsumptionService.findAll());
    }

    @PostMapping
    public ResponseEntity<String> createEnergyDataMessage(@RequestBody HourlyConsumption hourlyConsumption) {
        hourlyConsumptionService.createHourlyConsumption(hourlyConsumption);
        return new ResponseEntity<>("Consumption added succesfully", HttpStatus.CREATED);
    }

}
