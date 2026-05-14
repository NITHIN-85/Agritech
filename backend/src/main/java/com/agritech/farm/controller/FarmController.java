package com.agritech.farm.controller;

import com.agritech.auth.model.User;
import com.agritech.auth.repository.UserRepository;
import com.agritech.farm.model.Farm;
import com.agritech.farm.repository.FarmRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/farms")
public class FarmController {

    @Autowired
    private FarmRepository farmRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/user/{userId}")
    public List<Farm> getFarmsByUserId(@PathVariable Long userId) {
        return farmRepository.findByFarmerId(userId);
    }

    @PostMapping("/user/{userId}")
    public Farm addFarm(@PathVariable Long userId, @RequestBody Farm farm) {
        System.out.println("Adding farm for user " + userId + ": " + farm.getFarmName());
        try {
            User farmer = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
            farm.setFarmer(farmer);
            return farmRepository.save(farm);
        } catch (Exception e) {
            e.printStackTrace(); // This will show in your terminal
            throw e;
        }
    }
}
