package com.agritech.farm.dto;

import lombok.Data;

@Data
public class PredictionRequest {
    private String cropName;
    private Double acres;
    private Double lat;
    private Double lng;
    private String location;
}
