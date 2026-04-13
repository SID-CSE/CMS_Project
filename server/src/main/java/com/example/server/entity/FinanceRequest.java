package com.example.server.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "finance_requests")
public class FinanceRequest {

    @Id
    @Column(columnDefinition = "CHAR(36)")
    private String id;

    @Column(name = "project_id", nullable = false, columnDefinition = "CHAR(36)")
    private String projectId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "project_id", insertable = false, updatable = false)
    private ProjectRequest project;

    @Column(name = "requested_by", nullable = false, columnDefinition = "CHAR(36)")
    private String requestedBy;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "requested_by", insertable = false, updatable = false)
    private User admin;

    @Column(name = "stakeholder_id", nullable = false, columnDefinition = "CHAR(36)")
    private String stakeholderId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "stakeholder_id", insertable = false, updatable = false)
    private User stakeholder;

    @Column(name = "total_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "company_profit_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal companyProfitAmount = BigDecimal.ZERO;

    @Column(name = "note", columnDefinition = "LONGTEXT")
    private String note;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FinanceStatus status = FinanceStatus.SENT;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Column(name = "distributed_at")
    private LocalDateTime distributedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public FinanceRequest() {
    }

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

    public ProjectRequest getProject() {
        return project;
    }

    public void setProject(ProjectRequest project) {
        this.project = project;
    }

    public String getRequestedBy() {
        return requestedBy;
    }

    public void setRequestedBy(String requestedBy) {
        this.requestedBy = requestedBy;
    }

    public User getAdmin() {
        return admin;
    }

    public void setAdmin(User admin) {
        this.admin = admin;
    }

    public String getStakeholderId() {
        return stakeholderId;
    }

    public void setStakeholderId(String stakeholderId) {
        this.stakeholderId = stakeholderId;
    }

    public User getStakeholder() {
        return stakeholder;
    }

    public void setStakeholder(User stakeholder) {
        this.stakeholder = stakeholder;
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

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public FinanceStatus getStatus() {
        return status;
    }

    public void setStatus(FinanceStatus status) {
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

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        this.id = UUID.randomUUID().toString();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public enum FinanceStatus {
        SENT, PAID, DISTRIBUTED, CANCELLED
    }
}