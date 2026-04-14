package com.example.server.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "project_requests")
public class ProjectRequest {

    @Id
    @Column(columnDefinition = "CHAR(36)")
    private String id;

    @Column(name = "client_id", nullable = false, columnDefinition = "CHAR(36)")
    private String clientId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "client_id", insertable = false, updatable = false)
    private User client;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String description;

    @Column(name = "content_types", columnDefinition = "JSON")
    private String contentTypes; // Stored as JSON array string

    @Column(nullable = false)
    private LocalDate deadline;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProjectStatus status = ProjectStatus.REQUESTED;

    @Column(name = "stakeholder_rating")
    private Integer stakeholderRating;

    @Column(name = "stakeholder_feedback", columnDefinition = "LONGTEXT")
    private String stakeholderFeedback;

    @Column(name = "stakeholder_reviewed_at")
    private LocalDateTime stakeholderReviewedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public ProjectRequest() {}

    public ProjectRequest(String clientId, String title, String description, String contentTypes, LocalDate deadline, ProjectStatus status) {
        this.clientId = clientId;
        this.title = title;
        this.description = description;
        this.contentTypes = contentTypes;
        this.deadline = deadline;
        this.status = status;
    }

    public ProjectRequest(String id, String clientId, User client, String title, String description, String contentTypes, LocalDate deadline, ProjectStatus status, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.clientId = clientId;
        this.client = client;
        this.title = title;
        this.description = description;
        this.contentTypes = contentTypes;
        this.deadline = deadline;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getClientId() { return clientId; }
    public void setClientId(String clientId) { this.clientId = clientId; }

    public User getClient() { return client; }
    public void setClient(User client) { this.client = client; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getContentTypes() { return contentTypes; }
    public void setContentTypes(String contentTypes) { this.contentTypes = contentTypes; }

    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }

    public ProjectStatus getStatus() { return status; }
    public void setStatus(ProjectStatus status) { this.status = status; }

    public Integer getStakeholderRating() { return stakeholderRating; }
    public void setStakeholderRating(Integer stakeholderRating) { this.stakeholderRating = stakeholderRating; }

    public String getStakeholderFeedback() { return stakeholderFeedback; }
    public void setStakeholderFeedback(String stakeholderFeedback) { this.stakeholderFeedback = stakeholderFeedback; }

    public LocalDateTime getStakeholderReviewedAt() { return stakeholderReviewedAt; }
    public void setStakeholderReviewedAt(LocalDateTime stakeholderReviewedAt) { this.stakeholderReviewedAt = stakeholderReviewedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

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

    public enum ProjectStatus {
        REQUESTED, PLAN_SENT, IN_PROGRESS, DELIVERED, REVISION, SIGNED_OFF
    }
}
