package org.example.cryptoportfolio.repository;

import org.example.cryptoportfolio.model.PortfolioCoin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CoinRepository extends JpaRepository<PortfolioCoin, Long> {
}
