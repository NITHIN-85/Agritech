package com.agritech.farm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsDTO {
    private List<Map<String, Object>> yieldForecast;
    private List<Map<String, Object>> expenseBreakdown;
    private List<Map<String, Object>> revenueTrends;
    private Double projectedROI;
    private Double confidenceScore;
}
