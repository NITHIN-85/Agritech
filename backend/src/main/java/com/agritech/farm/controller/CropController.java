package com.agritech.farm.controller;

import com.agritech.farm.model.Crop;
import com.agritech.farm.model.Farm;
import com.agritech.farm.repository.CropRepository;
import com.agritech.farm.repository.FarmRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/crops")
public class CropController {

    @Autowired
    private CropRepository cropRepository;

    @Autowired
    private FarmRepository farmRepository;

    @GetMapping("/farm/{farmId}")
    public List<Crop> getCropsByFarmId(@PathVariable Long farmId) {
        return cropRepository.findByFarmId(farmId);
    }

    @PostMapping("/farm/{farmId}")
    public Crop addCrop(@PathVariable Long farmId, @RequestBody Crop crop) {
        Farm farm = farmRepository.findById(farmId).orElseThrow();
        crop.setFarm(farm);
        return cropRepository.save(crop);
    }
}
