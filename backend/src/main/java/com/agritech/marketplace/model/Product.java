package com.agritech.marketplace.model;

import com.agritech.auth.model.User;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private Double price;
    private String unit; // e.g., kg, tons
    
    // The farmer who listed the product
    @ManyToOne
    @JoinColumn(name = "farmer_id")
    private User farmer;

    // Added as per user's schema: available_quantity, status, crop_id
    private Integer availableQuantity;
    private String status; // e.g., AVAILABLE, SOLD_OUT
    
    // We'll link crop_id in phase 3
    private Long cropId;
}
