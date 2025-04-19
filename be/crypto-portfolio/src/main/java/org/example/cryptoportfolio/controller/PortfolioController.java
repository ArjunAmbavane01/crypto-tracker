package org.example.cryptoportfolio.controller;

import lombok.RequiredArgsConstructor;
import org.example.cryptoportfolio.dto.PortfolioRequestDto;
import org.example.cryptoportfolio.model.PortfolioCoin;
import org.example.cryptoportfolio.model.Portfolio;
import org.example.cryptoportfolio.model.User;
import org.example.cryptoportfolio.repository.PortfolioRepository;
import org.example.cryptoportfolio.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/portfolios")
@RequiredArgsConstructor
public class PortfolioController {

    private final PortfolioRepository portfolioRepository;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createPortfolio(@RequestBody PortfolioRequestDto dto) {
        User user = userRepository.findById(dto.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));

        Portfolio portfolio = new Portfolio();
        portfolio.setName(dto.getName());
        portfolio.setLocked(dto.isLocked());
        portfolio.setTotalValue(dto.getTotalValue());
        portfolio.setChange24h(dto.getChange24h());
        portfolio.setUser(user);

        List<PortfolioCoin> portfolioCoins = dto.getCoins().stream().map(c -> {
            PortfolioCoin portfolioCoin = new PortfolioCoin();
            portfolioCoin.setCoinId(c.getCoinId());
            portfolioCoin.setName(c.getName());
            portfolioCoin.setSymbol(c.getSymbol());
            portfolioCoin.setAmount(c.getAmount());
            portfolioCoin.setValue(c.getValue());
            portfolioCoin.setChange24h(c.getChange24h());
            portfolioCoin.setPortfolio(portfolio);
            return portfolioCoin;
        }).collect(Collectors.toList());

        portfolio.setPortfolioCoins(portfolioCoins);
        portfolioRepository.save(portfolio);

        return ResponseEntity.ok("Portfolio created successfully");
    }
}
