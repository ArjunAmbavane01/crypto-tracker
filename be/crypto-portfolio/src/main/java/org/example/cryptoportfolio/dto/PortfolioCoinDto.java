package org.example.cryptoportfolio.dto;

import lombok.Data;

@Data
public class PortfolioCoinDto {
    private String coinId;
    private String name;
    private String symbol;
    private double amount;
    private double value;
    private double change24h;
}
