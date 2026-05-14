package com.agritech.marketplace.controller;

import com.agritech.marketplace.model.Product;
import com.agritech.marketplace.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<Product> getAllProducts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String unit,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String location) {
        
        // Simplified filtering for now
        return productRepository.findAll().stream()
            .filter(p -> name == null || p.getName().toLowerCase().contains(name.toLowerCase()))
            .filter(p -> unit == null || p.getUnit().equalsIgnoreCase(unit))
            .filter(p -> maxPrice == null || p.getPrice() <= maxPrice)
            .filter(p -> location == null || (p.getFarmer() != null && p.getFarmer().getLocation().equalsIgnoreCase(location)))
            .toList();
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }
}
