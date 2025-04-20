package org.example.cryptoportfolio.controller;

import lombok.RequiredArgsConstructor;
import org.example.cryptoportfolio.dto.PortfolioRequestDto;
import org.example.cryptoportfolio.model.PortfolioCoin;
import org.example.cryptoportfolio.model.Portfolio;
import org.example.cryptoportfolio.model.User;
import org.example.cryptoportfolio.repository.PortfolioRepository;
import org.example.cryptoportfolio.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
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
            Portfolio portfolio = portfolioToDelete.get();
            user.getPortfolios().remove(portfolio); // This line is critical
            portfolioRepository.delete(portfolio);
            return ResponseEntity.ok("Portfolio deleted successfully");
        } else {
            return ResponseEntity.badRequest().body("Portfolio not found for this user");
        }
    }


    @PutMapping("/update")
    public ResponseEntity<?> updatePortfolio(@RequestBody Map<String, Object> updateData) {
        try {
            // Extract data from request
            String userId = (String) updateData.get("userId");
            String originalName = (String) updateData.get("originalName");
            String newName = (String) updateData.get("name");
            double totalValue = ((Number) updateData.get("totalValue")).doubleValue();
            double change24h = ((Number) updateData.get("change24h")).doubleValue();

            // Get the list of coins
            List<Map<String, Object>> coinsList = (List<Map<String, Object>>) updateData.get("coins");

            // Find the user
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Find the portfolio to update
            Optional<Portfolio> portfolioOptional = user.getPortfolios().stream()
                    .filter(p -> p.getName().equals(originalName))
                    .findFirst();

            if (portfolioOptional.isEmpty()) {
                return ResponseEntity.badRequest().body("Portfolio not found");
            }

            Portfolio portfolio = portfolioOptional.get();

            // Check if portfolio is locked
            if (portfolio.isLocked()) {
                return ResponseEntity.badRequest().body("Cannot edit a locked portfolio");
            }

            // Update portfolio basic info
            portfolio.setName(newName);
            portfolio.setTotalValue(totalValue);
            portfolio.setChange24h(change24h);

            // Keep track of existing coins to avoid orphan deletion issues
            List<PortfolioCoin> existingCoins = new ArrayList<>(portfolio.getPortfolioCoins());
            portfolio.getPortfolioCoins().clear();

            // Create new coins and add them to portfolio
            for (Map<String, Object> coinData : coinsList) {
                PortfolioCoin coin = new PortfolioCoin();
                coin.setCoinId((String) coinData.get("id"));
                coin.setName((String) coinData.get("name"));
                coin.setSymbol((String) coinData.get("symbol"));
                coin.setAmount(((Number) coinData.get("amount")).doubleValue());
                coin.setValue(((Number) coinData.get("value")).doubleValue());
                coin.setChange24h(((Number) coinData.get("change24h")).doubleValue());
                coin.setPortfolio(portfolio);
                portfolio.getPortfolioCoins().add(coin);
            }

            // Save updated portfolio
            portfolioRepository.save(portfolio);

            return ResponseEntity.ok("Portfolio updated successfully");
        } catch (Exception e) {
            e.printStackTrace(); // Add this for better debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating portfolio: " + e.getMessage());
        }
    }
}