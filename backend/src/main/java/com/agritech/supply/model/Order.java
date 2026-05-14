package com.agritech.supply.model;

import com.agritech.auth.model.User;
import com.agritech.marketplace.model.Product;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne
    @JoinColumn(name = "buyer_id")
    private User buyer;

    private Integer quantity;
    private Double totalPrice;
    
    // PLACED, SHIPPED, DELIVERED
    private String status;
    
    private LocalDateTime orderDate;
}
