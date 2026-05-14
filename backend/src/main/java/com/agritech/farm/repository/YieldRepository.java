package com.agritech.farm.repository;

import com.agritech.farm.model.Yield;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface YieldRepository extends JpaRepository<Yield, Long> {
    List<Yield> findByFarmerId(Long farmerId);
}
