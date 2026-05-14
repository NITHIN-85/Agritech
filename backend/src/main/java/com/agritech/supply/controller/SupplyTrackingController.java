package com.agritech.supply.controller;

import com.agritech.supply.model.SupplyTracking;
import com.agritech.supply.repository.SupplyTrackingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tracking")
@CrossOrigin(origins = "*")
public class SupplyTrackingController {

    @Autowired
    private SupplyTrackingRepository trackingRepository;

    @GetMapping("/order/{orderId}")
    public List<SupplyTracking> getTrackingForOrder(@PathVariable Long orderId) {
        return trackingRepository.findByOrderId(orderId);
    }
}
