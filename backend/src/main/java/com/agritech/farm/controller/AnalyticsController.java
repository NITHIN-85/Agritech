package com.agritech.farm.controller;

import com.agritech.farm.dto.AnalyticsDTO;
import com.agritech.farm.dto.PredictionRequest;
import com.agritech.farm.model.Crop;
import com.agritech.farm.repository.CropRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    @Autowired
    private CropRepository cropRepository;

    @GetMapping("/user/{userId}")
    public ResponseEntity<AnalyticsDTO> getAIAnalytics(@PathVariable Long userId) {
        List<Crop> userCrops = cropRepository.findAll().stream()
                .filter(c -> c.getFarm().getFarmer().getId().equals(userId))
                .toList();

        AnalyticsDTO analytics = new AnalyticsDTO();
        
        // 1. Yield Forecast Simulation
        List<Map<String, Object>> yieldForecast = new ArrayList<>();
        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"};
        double baseYield = userCrops.stream().mapToDouble(c -> c.getExpectedYield() != null ? c.getExpectedYield() : 100.0).average().orElse(150.0);
        
        for (int i = 0; i < months.length; i++) {
            Map<String, Object> data = new HashMap<>();
            data.put("month", months[i]);
            double actual = baseYield + (Math.random() * 20 - 10);
            double predicted = actual + (Math.random() * 15 - 5);
            data.put("actual", i < 5 ? actual : null); 
            data.put("predicted", predicted);
            yieldForecast.add(data);
        }
        analytics.setYieldForecast(yieldForecast);

        // 2. Expense Breakdown
        List<Map<String, Object>> expenses = new ArrayList<>();
        expenses.add(Map.of("name", "Seeds", "value", 2500, "color", "#8B5CF6"));
        expenses.add(Map.of("name", "Fertilizer", "value", 1800, "color", "#10B981"));
        expenses.add(Map.of("name", "Machinery", "value", 3200, "color", "#F59E0B"));
        expenses.add(Map.of("name", "Labor", "value", 1500, "color", "#EF4444"));
        analytics.setExpenseBreakdown(expenses);

        // 3. Revenue Trends
        List<Map<String, Object>> revenue = new ArrayList<>();
        for (int i = 0; i < months.length; i++) {
            Map<String, Object> data = new HashMap<>();
            data.put("month", months[i]);
            data.put("revenue", 5000 + (Math.random() * 3000));
            revenue.add(data);
        }
        analytics.setRevenueTrends(revenue);

        // 4. ROI & Confidence
        analytics.setProjectedROI(24.5);
        analytics.setConfidenceScore(88.0);

        return ResponseEntity.ok(analytics);
    }

    @PostMapping("/predict")
    public ResponseEntity<AnalyticsDTO> predictNewCrop(@RequestBody PredictionRequest request) {
        System.out.println("AI Prediction Request Received: " + request);
        AnalyticsDTO analytics = new AnalyticsDTO();
        double acres = request.getAcres() != null ? request.getAcres() : 1.0;
        
        // 1. Scaled Yield Forecast
        List<Map<String, Object>> yieldForecast = new ArrayList<>();
        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"};
        double baseYieldPerAcre = 50.0; // Base yield multiplier
        
        for (int i = 0; i < months.length; i++) {
            Map<String, Object> data = new HashMap<>();
            data.put("month", months[i]);
            double predicted = (baseYieldPerAcre * acres) + (Math.random() * 50 * acres);
            data.put("actual", null); // In simulation, all is predicted
            data.put("predicted", predicted);
            yieldForecast.add(data);
        }
        analytics.setYieldForecast(yieldForecast);

        // 2. Scaled Expense Breakdown
        List<Map<String, Object>> expenses = new ArrayList<>();
        expenses.add(Map.of("name", "Seeds", "value", 1000 * acres, "color", "#8B5CF6"));
        expenses.add(Map.of("name", "Fertilizer", "value", 800 * acres, "color", "#10B981"));
        expenses.add(Map.of("name", "Machinery", "value", 1500 * acres, "color", "#F59E0B"));
        expenses.add(Map.of("name", "Labor", "value", 500 * acres, "color", "#EF4444"));
        analytics.setExpenseBreakdown(expenses);

        // 3. Scaled Revenue Trends
        List<Map<String, Object>> revenue = new ArrayList<>();
        for (int i = 0; i < months.length; i++) {
            Map<String, Object> data = new HashMap<>();
            data.put("month", months[i]);
            data.put("revenue", (4000 * acres) + (Math.random() * 2000 * acres));
            revenue.add(data);
        }
        analytics.setRevenueTrends(revenue);

        // 4. ROI & Confidence based on location logic (mocked)
        analytics.setProjectedROI(15.0 + (Math.random() * 20));
        analytics.setConfidenceScore(85.0 + (Math.random() * 10));

        return ResponseEntity.ok(analytics);
    }
}
