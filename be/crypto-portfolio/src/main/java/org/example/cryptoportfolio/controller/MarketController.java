package org.example.cryptoportfolio.controller;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.cryptoportfolio.dto.CoinDto;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/market")
public class MarketController {

    @GetMapping("/top-coins")
    public ResponseEntity<String> getTopCoins() throws IOException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=24h,7d"))
                .GET()
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        return ResponseEntity.ok(response.body());
    }

    @GetMapping("/trending")
    public ResponseEntity<String> getTrendingCoins() throws IOException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();

        HttpRequest trendingRequest = HttpRequest.newBuilder()
                .uri(URI.create("https://api.coingecko.com/api/v3/search/trending"))
                .GET()
                .build();

        HttpResponse<String> trendingResponse = client.send(trendingRequest, HttpResponse.BodyHandlers.ofString());

        return ResponseEntity.ok(trendingResponse.body());
    }

    @GetMapping("/coins")
    public ResponseEntity<?> getAvailableCoins() {
        try {
            HttpClient client = HttpClient.newHttpClient();

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1"))
                    .GET()
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(response.body());

// Handle rate limit or error object
            if (rootNode.has("status") && rootNode.get("status").has("error_code")) {
                int errorCode = rootNode.get("status").get("error_code").asInt();
                String errorMsg = rootNode.get("status").get("error_message").asText();
                return ResponseEntity.status(errorCode).body("API error: " + errorMsg);
            }

// Continue only if response is array
            if (!rootNode.isArray()) {
                return ResponseEntity.status(502).body("Unexpected response format: " + rootNode.toString());
            }

            List<Map<String, Object>> fullData = mapper.convertValue(
                    rootNode,
                    mapper.getTypeFactory().constructCollectionType(List.class, Map.class)
            );


            List<CoinDto> simplifiedCoins = fullData.stream()
                    .map(coin -> new CoinDto(
                            (String) coin.get("id"),
                            (String) coin.get("name"),
                            (String) coin.get("symbol"),
                            ((Number) coin.get("current_price")).doubleValue(),
                            (String) coin.get("image")
                    ))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(simplifiedCoins);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to fetch coins: " + e.getMessage());
        }
    }


}
