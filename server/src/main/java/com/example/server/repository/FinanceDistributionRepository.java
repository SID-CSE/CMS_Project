package com.example.server.repository;

import com.example.server.entity.FinanceDistribution;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FinanceDistributionRepository extends JpaRepository<FinanceDistribution, String> {
    List<FinanceDistribution> findByRequestIdOrderByCreatedAtAsc(String requestId);
    List<FinanceDistribution> findByRecipientUserIdOrderByCreatedAtDesc(String recipientUserId);
}