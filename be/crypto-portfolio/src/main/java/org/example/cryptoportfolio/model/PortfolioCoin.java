package org.example.cryptoportfolio.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Portfoliocoins")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PortfolioCoin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String coinId;
    private String name;
    private String symbol;
    private double amount;
    private double value;
    private double change24h;

    @ManyToOne
    @JoinColumn(name = "portfolio_id")
    @JsonBackReference
    private Portfolio portfolio;
}
