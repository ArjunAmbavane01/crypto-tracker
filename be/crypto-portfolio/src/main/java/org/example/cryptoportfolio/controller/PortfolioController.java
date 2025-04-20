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
import java.util.Optional;
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

    /**
     * Get all portfolios for a specific user
     */
    @GetMapping("/user/{clerkId}")
    public ResponseEntity<?> getUserPortfolios(@PathVariable String clerkId) {
        User user = userRepository.findById(clerkId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(user.getPortfolios());
    }

    /**
     * Delete a portfolio by user ID and portfolio name
     */
    @DeleteMapping("/delete")
    public ResponseEntity<?> deletePortfolio(@RequestParam String clerkId, @RequestParam String portfolioName) {
        User user = userRepository.findById(clerkId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Find the portfolio with matching name belonging to the user
        Optional<Portfolio> portfolioToDelete = user.getPortfolios().stream()
                .filter(portfolio -> portfolio.getName().equals(portfolioName))
                .findFirst();

        if (portfolioToDelete.isPresent()) {
            portfolioRepository.delete(portfolioToDelete.get());
            return ResponseEntity.ok("Portfolio deleted successfully");
        } else {
            return ResponseEntity.badRequest().body("Portfolio not found for this user");
        }
    }
}