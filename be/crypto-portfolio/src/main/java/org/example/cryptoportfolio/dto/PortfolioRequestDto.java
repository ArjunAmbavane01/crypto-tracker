package org.example.cryptoportfolio.dto;

import lombok.Data;

import java.util.List;

@Data
public class PortfolioRequestDto {
    private String userId;
    private String name;
    private boolean isLocked;
    private double totalValue;
    private double change24h;
    private List<PortfolioCoinDto> coins;
}
