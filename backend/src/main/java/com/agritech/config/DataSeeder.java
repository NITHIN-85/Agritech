package com.agritech.config;

import com.agritech.auth.model.User;
import com.agritech.auth.repository.UserRepository;
import com.agritech.marketplace.model.Product;
import com.agritech.marketplace.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner loadData(UserRepository userRepository, ProductRepository productRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                User farmer1 = new User(null, "John Doe", "john@farm.com", passwordEncoder.encode("password"), "FARMER", "New York");
                User farmer2 = new User(null, "Jane Smith", "jane@farm.com", passwordEncoder.encode("password"), "FARMER", "California");
                User buyer = new User(null, "Buyer", "buyer@example.com", passwordEncoder.encode("password"), "BUYER", "Chicago");
                userRepository.saveAll(List.of(farmer1, farmer2, buyer));

                Product p1 = new Product(null, "Organic Tomatoes", "Fresh organic tomatoes picked today", 2.50, "kg", farmer1, 100, "AVAILABLE", null);
                Product p2 = new Product(null, "Wheat", "High-quality winter wheat", 300.0, "ton", farmer2, 50, "AVAILABLE", null);
                Product p3 = new Product(null, "Apples", "Crisp red apples", 3.00, "kg", farmer1, 200, "AVAILABLE", null);
                Product p4 = new Product(null, "Potatoes", "Golden potatoes direct from farm", 1.20, "kg", farmer2, 150, "AVAILABLE", null);
                Product p5 = new Product(null, "Carrots", "Crunchy sweet carrots", 1.80, "kg", farmer1, 120, "AVAILABLE", null);
                Product p6 = new Product(null, "Corn", "Sweet corn stalks", 0.50, "ear", farmer2, 300, "AVAILABLE", null);
                Product p7 = new Product(null, "Basmati Rice", "Premium long-grain aged rice", 85.0, "kg", farmer1, 500, "AVAILABLE", null);
                Product p8 = new Product(null, "Lentils", "Split red lentils (Masoor Dal)", 60.0, "kg", farmer2, 250, "AVAILABLE", null);
                Product p9 = new Product(null, "Mustard Seeds", "Organic black mustard seeds", 120.0, "kg", farmer1, 100, "AVAILABLE", null);
                Product p10 = new Product(null, "Turmeric", "High-curcumin turmeric powder", 250.0, "kg", farmer2, 80, "AVAILABLE", null);
                Product p11 = new Product(null, "Chickpeas", "Large size garbanzo beans", 95.0, "kg", farmer1, 300, "AVAILABLE", null);
                Product p12 = new Product(null, "Barley", "Nutritious whole grain barley", 40.0, "kg", farmer2, 400, "AVAILABLE", null);
                Product p13 = new Product(null, "Moong Dal", "Yellow split mung beans", 110.0, "kg", farmer1, 150, "AVAILABLE", null);
                
                productRepository.saveAll(List.of(p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13));
                
                System.out.println("Dummy data loaded.");
            }
        };
    }
}
