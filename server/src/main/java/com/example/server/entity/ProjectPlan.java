package com.example.server.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "project_plans")
public class ProjectPlan {

    @Id
    @Column(columnDefinition = "CHAR(36)")
    private String id;

    @Column(name = "project_id", nullable = false, columnDefinition = "CHAR(36)", unique = true)
    private String projectId;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "project_id", insertable = false, updatable = false)
    private ProjectRequest project;

    @Column(name = "created_by", nullable = false, columnDefinition = "CHAR(36)")
    private String createdBy;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "created_by", insertable = false, updatable = false)
    private User admin;

    @Column(name = "timeline_start", nullable = false)
    private LocalDate timelineStart;

    @Column(name = "timeline_end", nullable = false)
    private LocalDate timelineEnd;

    @Column(columnDefinition = "LONGTEXT")
    private String notes;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @Column(name = "accepted_at")
    private LocalDateTime acceptedAt;

    @Column(name = "client_feedback", columnDefinition = "LONGTEXT")
    private String clientFeedback;

    @OneToMany(mappedBy = "plan", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<PlanMilestone> milestones;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public ProjectPlan() {}

    public ProjectPlan(String id, String projectId, ProjectRequest project, String createdBy, User admin, LocalDate timelineStart, LocalDate timelineEnd, String notes, LocalDateTime sentAt, LocalDateTime acceptedAt, String clientFeedback, List<PlanMilestone> milestones, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.projectId = projectId;
        this.project = project;
        this.createdBy = createdBy;
        this.admin = admin;
        this.timelineStart = timelineStart;
        this.timelineEnd = timelineEnd;
        this.notes = notes;
        this.sentAt = sentAt;
        this.acceptedAt = acceptedAt;
        this.clientFeedback = clientFeedback;
        this.milestones = milestones;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }

    public ProjectRequest getProject() { return project; }
    public void setProject(ProjectRequest project) { this.project = project; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public User getAdmin() { return admin; }
    public void setAdmin(User admin) { this.admin = admin; }

    public LocalDate getTimelineStart() { return timelineStart; }
    public void setTimelineStart(LocalDate timelineStart) { this.timelineStart = timelineStart; }

    public LocalDate getTimelineEnd() { return timelineEnd; }
    public void setTimelineEnd(LocalDate timelineEnd) { this.timelineEnd = timelineEnd; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getSentAt() { return sentAt; }
    public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }

    public LocalDateTime getAcceptedAt() { return acceptedAt; }
    public void setAcceptedAt(LocalDateTime acceptedAt) { this.acceptedAt = acceptedAt; }

    public String getClientFeedback() { return clientFeedback; }
    public void setClientFeedback(String clientFeedback) { this.clientFeedback = clientFeedback; }

    public List<PlanMilestone> getMilestones() { return milestones; }
    public void setMilestones(List<PlanMilestone> milestones) { this.milestones = milestones; }

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
}
