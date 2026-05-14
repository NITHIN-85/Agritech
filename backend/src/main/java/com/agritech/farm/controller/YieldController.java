package com.agritech.farm.controller;

import com.agritech.auth.model.User;
import com.agritech.auth.repository.UserRepository;
import com.agritech.farm.model.Yield;
import com.agritech.farm.repository.YieldRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/yields")
public class YieldController {

    @Autowired
    private YieldRepository yieldRepository;
    
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/user/{userId}")
    public List<Yield> getUserYields(@PathVariable Long userId) {
        return yieldRepository.findByFarmerId(userId);
    }

    @PostMapping("/user/{userId}")
    public Yield logYield(@PathVariable Long userId, @RequestBody Yield yield) {
        User farmer = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        yield.setFarmer(farmer);
        return yieldRepository.save(yield);
    }
}
