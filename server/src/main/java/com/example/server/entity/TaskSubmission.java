package com.example.server.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "task_submissions")
public class TaskSubmission {

    @Id
    @Column(columnDefinition = "CHAR(36)")
    private String id;

    @Column(name = "task_id", nullable = false, columnDefinition = "CHAR(36)")
    private String taskId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "task_id", insertable = false, updatable = false)
    private Task task;

    @Column(name = "submitted_by", nullable = false, columnDefinition = "CHAR(36)")
    private String submittedBy;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "submitted_by", insertable = false, updatable = false)
    private User submitter;

    @Column(name = "s3_key")
    private String s3Key;

    @Column(name = "public_id")
    private String publicId;

    @Column(name = "cdn_url")
    private String cdnUrl;

    @Column(name = "file_type")
    private String fileType;

    @Column(name = "version_number")
    private Integer versionNumber = 1;

    @Column(name = "status")
    private String status = "SUBMITTED";

    @Column(name = "stakeholder_visible")
    private boolean stakeholderVisible = false;

    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;

    @Column(name = "admin_review_note", columnDefinition = "LONGTEXT")
    private String adminReviewNote;

    @Column(name = "stakeholder_rating")
    private Integer stakeholderRating;

    @Column(name = "stakeholder_review", columnDefinition = "LONGTEXT")
    private String stakeholderReview;

    @Column(name = "stakeholder_reviewed_at")
    private LocalDateTime stakeholderReviewedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public TaskSubmission() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTaskId() {
        return taskId;
    }

    public void setTaskId(String taskId) {
        this.taskId = taskId;
    }

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }

    public String getSubmittedBy() {
        return submittedBy;
    }

    public void setSubmittedBy(String submittedBy) {
        this.submittedBy = submittedBy;
    }

    public User getSubmitter() {
        return submitter;
    }

    public void setSubmitter(User submitter) {
        this.submitter = submitter;
    }

    public String getS3Key() {
        return s3Key;
    }

    public void setS3Key(String s3Key) {
        this.s3Key = s3Key;
    }

    public String getPublicId() {
        return publicId;
    }

    public void setPublicId(String publicId) {
        this.publicId = publicId;
    }

    public String getCdnUrl() {
        return cdnUrl;
    }

    public void setCdnUrl(String cdnUrl) {
        this.cdnUrl = cdnUrl;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public Integer getVersionNumber() {
        return versionNumber;
    }

    public void setVersionNumber(Integer versionNumber) {
        this.versionNumber = versionNumber;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isStakeholderVisible() {
        return stakeholderVisible;
    }

    public void setStakeholderVisible(boolean stakeholderVisible) {
        this.stakeholderVisible = stakeholderVisible;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public String getAdminReviewNote() {
        return adminReviewNote;
    }

    public void setAdminReviewNote(String adminReviewNote) {
        this.adminReviewNote = adminReviewNote;
    }

    public Integer getStakeholderRating() {
        return stakeholderRating;
    }

    public void setStakeholderRating(Integer stakeholderRating) {
        this.stakeholderRating = stakeholderRating;
    }

    public String getStakeholderReview() {
        return stakeholderReview;
    }

    public void setStakeholderReview(String stakeholderReview) {
        this.stakeholderReview = stakeholderReview;
    }

    public LocalDateTime getStakeholderReviewedAt() {
        return stakeholderReviewedAt;
    }

    public void setStakeholderReviewedAt(LocalDateTime stakeholderReviewedAt) {
        this.stakeholderReviewedAt = stakeholderReviewedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        this.id = UUID.randomUUID().toString();
        this.submittedAt = LocalDateTime.now();
        this.createdAt = LocalDateTime.now();
        if (this.publicId == null || this.publicId.isBlank()) {
            this.publicId = (this.s3Key != null && !this.s3Key.isBlank()) ? this.s3Key : UUID.randomUUID().toString();
        }
        if (this.status == null) {
            this.status = "SUBMITTED";
        }
    }
}
