package com.agritech.supply.repository;

import com.agritech.supply.model.SupplyTracking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SupplyTrackingRepository extends JpaRepository<SupplyTracking, Long> {
    List<SupplyTracking> findByOrderId(Long orderId);
}
