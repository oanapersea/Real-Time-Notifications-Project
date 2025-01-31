package com.example.devicems.device;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/device")
public class DeviceController {

    private DeviceService deviceService;
    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    @GetMapping
    public ResponseEntity<List<Device>> findAll(){
        return ResponseEntity.ok(deviceService.findAll());
    }

    @GetMapping("/{id}/maxConsumption")
    public ResponseEntity<String> getMaxConsumptionById(@PathVariable Long id){
        return ResponseEntity.ok(deviceService.getMaxConsumption(id));
    }


    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Device>> getDevicesByUserId(@PathVariable Long userId) {
        List<Device> devices = deviceService.findDevicesByUserId(userId);
        if (devices == null || devices.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(devices);
    }
    @PostMapping
    public ResponseEntity<String> createDevice(@RequestBody Device device) {
        deviceService.createDevice(device);
        return new ResponseEntity<>("Device added successfully", HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Device> getDeviceById(@PathVariable Long id) {
        Device device = deviceService.getDeviceById(id);
        if(device!=null) {
            return new ResponseEntity<>(device, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDevice(@PathVariable Long id) {
        boolean deleted=deviceService.deleteDeviceById(id);
        if(deleted) {
            return new ResponseEntity<>("Device deleted successfully",HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateDevice(@PathVariable Long id, @RequestBody Device updatedDevice) {
        boolean updated = deviceService.updateDevice(id, updatedDevice);
        if(updated) {
            return new ResponseEntity<>("Device updated successfully", HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

}
