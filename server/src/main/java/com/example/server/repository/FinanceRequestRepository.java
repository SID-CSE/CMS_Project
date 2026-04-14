package com.example.server.repository;

import com.example.server.entity.FinanceRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FinanceRequestRepository extends JpaRepository<FinanceRequest, String> {
    List<FinanceRequest> findByProjectIdOrderByCreatedAtDesc(String projectId);
    List<FinanceRequest> findByStakeholderIdOrderByCreatedAtDesc(String stakeholderId);
    List<FinanceRequest> findByRequestedByOrderByCreatedAtDesc(String requestedBy);
}