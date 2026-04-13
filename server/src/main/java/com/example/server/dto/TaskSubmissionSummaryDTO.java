package com.example.server.dto;

import java.time.LocalDateTime;

public class TaskSubmissionSummaryDTO {
    private String id;
    private String taskId;
    private String publicId;
    private String fileType;
    private Integer versionNumber;
    private String status;
    private boolean stakeholderVisible;
    private LocalDateTime submittedAt;
    private String adminReviewNote;
    private String mediaUrl;

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

    public String getPublicId() {
        return publicId;
    }

    public void setPublicId(String publicId) {
        this.publicId = publicId;
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

    public String getMediaUrl() {
        return mediaUrl;
    }

    public void setMediaUrl(String mediaUrl) {
        this.mediaUrl = mediaUrl;
    }
}