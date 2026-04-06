package com.example.server.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

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

    @Column(name = "cdn_url")
    private String cdnUrl;

    @Column(name = "file_type")
    private String fileType;

    @Column(name = "version_number")
    private Integer versionNumber = 1;

    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;

    @Column(name = "admin_review_note", columnDefinition = "LONGTEXT")
    private String adminReviewNote;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public TaskSubmission() {
    }

    public TaskSubmission(String id, String taskId, Task task, String submittedBy, User submitter, String s3Key, String cdnUrl, String fileType, Integer versionNumber, LocalDateTime submittedAt, String adminReviewNote, LocalDateTime createdAt) {
        this.id = id;
        this.taskId = taskId;
        this.task = task;
        this.submittedBy = submittedBy;
        this.submitter = submitter;
        this.s3Key = s3Key;
        this.cdnUrl = cdnUrl;
        this.fileType = fileType;
        this.versionNumber = versionNumber;
        this.submittedAt = submittedAt;
        this.adminReviewNote = adminReviewNote;
        this.createdAt = createdAt;
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
    }
}
