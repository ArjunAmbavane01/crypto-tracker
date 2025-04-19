package org.example.cryptoportfolio.dto;

import lombok.Data;

@Data
public class CoinDto {
    private String id;
    private String name;
    private String symbol;
    private double price;
    private String image;

    public CoinDto(String id, String name, String symbol, double price, String image) {
        this.id = id;
        this.name = name;
        this.symbol = symbol;
        this.price = price;
        this.image = image;
    }
}