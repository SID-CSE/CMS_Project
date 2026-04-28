package com.example.server.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class FinanceRequestDTO {
    private String id;
    private String projectId;
    private String projectTitle;
    private String stakeholderId;
    private String stakeholderName;
    private BigDecimal totalAmount;
    private BigDecimal companyProfitAmount;
    private BigDecimal workerPoolAmount;
    private String note;
    private String status;
    private LocalDateTime paidAt;
    private LocalDateTime distributedAt;
    private LocalDateTime createdAt;
    private List<UserSummaryDTO> eligibleRecipients;
    private List<FinanceDistributionDTO> distributions;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getProjectTitle() {
        return projectTitle;
    }

    public void setProjectTitle(String projectTitle) {
        this.projectTitle = projectTitle;
    }

    public String getStakeholderId() {
        return stakeholderId;
    }

    public void setStakeholderId(String stakeholderId) {
        this.stakeholderId = stakeholderId;
    }

    public String getStakeholderName() {
        return stakeholderName;
    }

    public void setStakeholderName(String stakeholderName) {
        this.stakeholderName = stakeholderName;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public BigDecimal getCompanyProfitAmount() {
        return companyProfitAmount;
    }

    public void setCompanyProfitAmount(BigDecimal companyProfitAmount) {
        this.companyProfitAmount = companyProfitAmount;
    }

    public BigDecimal getWorkerPoolAmount() {
        return workerPoolAmount;
    }

    public void setWorkerPoolAmount(BigDecimal workerPoolAmount) {
        this.workerPoolAmount = workerPoolAmount;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getPaidAt() {
        return paidAt;
    }

    public void setPaidAt(LocalDateTime paidAt) {
        this.paidAt = paidAt;
    }

    public LocalDateTime getDistributedAt() {
        return distributedAt;
    }

    public void setDistributedAt(LocalDateTime distributedAt) {
        this.distributedAt = distributedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<UserSummaryDTO> getEligibleRecipients() {
        return eligibleRecipients;
    }

    public void setEligibleRecipients(List<UserSummaryDTO> eligibleRecipients) {
        this.eligibleRecipients = eligibleRecipients;
    }

    public List<FinanceDistributionDTO> getDistributions() {
        return distributions;
    }

    public void setDistributions(List<FinanceDistributionDTO> distributions) {
        this.distributions = distributions;
    }
}