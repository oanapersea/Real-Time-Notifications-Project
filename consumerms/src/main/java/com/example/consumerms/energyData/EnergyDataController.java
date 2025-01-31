package com.example.consumerms.energyData;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/meterdevice")
public class EnergyDataController {

    private EnergyDataService energyDataService;
    public EnergyDataController(EnergyDataService energyDataService) {
       this.energyDataService = energyDataService;
    }

    @GetMapping
    public ResponseEntity<List<EnergyDataMessage>> findAll() {

       return ResponseEntity.ok(energyDataService.findAll());
    }

    @PostMapping
    public ResponseEntity<String> createEnergyDataMessage(@RequestBody EnergyDataMessage energyDataMessage) {
        energyDataService.createEnergyData(energyDataMessage);
        return new ResponseEntity<>("Device meter added succesfully", HttpStatus.CREATED);
    }

}
