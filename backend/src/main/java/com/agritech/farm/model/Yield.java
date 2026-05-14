package com.agritech.farm.model;

import com.agritech.auth.model.User;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "yields")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Yield {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String cropName;
    
    private Double quantityKg;
    
    private LocalDate harvestDate;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User farmer;
}
