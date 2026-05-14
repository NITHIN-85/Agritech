package com.agritech.config;

import com.agritech.auth.model.User;
import com.agritech.auth.repository.UserRepository;
import com.agritech.farm.model.Farm;
import com.agritech.farm.repository.FarmRepository;
import com.agritech.farm.model.Crop;
import com.agritech.farm.repository.CropRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FarmRepository farmRepository;

    @Autowired
    private CropRepository cropRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            System.out.println("Seeding database with default data...");

            // Create Farmer
            User farmer = new User();
            farmer.setName("Farmer Joe");
            farmer.setEmail("farmer@test.com");
            farmer.setPassword(passwordEncoder.encode("password123"));
            farmer.setRole("FARMER");
            farmer.setLocation("Ballari, Karnataka");
            userRepository.save(farmer);

            // Create Buyer
            User buyer = new User();
            buyer.setName("Buyer Sam");
            buyer.setEmail("buyer@test.com");
            buyer.setPassword(passwordEncoder.encode("password123"));
            buyer.setRole("BUYER");
            buyer.setLocation("Bangalore, Karnataka");
            userRepository.save(buyer);

            // Create default Farm for Joe
            Farm farm = new Farm();
            farm.setFarmName("Joe's Green Fields");
            farm.setLocation("Ballari East");
            farm.setSize(12.5);
            farm.setFarmer(farmer);
            farmRepository.save(farm);

            // Create default Crop
            Crop crop = new Crop();
            crop.setCropName("Cotton");
            crop.setSeason("Kharif");
            crop.setQuantity(500.0);
            crop.setExpectedYield(2000.0);
            crop.setActualYield(1850.0);
            crop.setFarm(farm);
            cropRepository.save(crop);

            System.out.println("Database seeded successfully.");
        }
    }
}
