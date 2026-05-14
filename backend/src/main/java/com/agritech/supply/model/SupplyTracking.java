package com.agritech.supply.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "supply_tracking")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupplyTracking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    private String status; // e.g., PACKED, SHIPPED, IN_TRANSIT, DELIVERED
    private String location;
    private LocalDateTime timestamp;
}
