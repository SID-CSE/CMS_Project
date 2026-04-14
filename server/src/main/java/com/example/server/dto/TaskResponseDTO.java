package com.example.server.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class TaskResponseDTO {

    private String id;
    private String projectId;
    private String projectTitle;
    private String title;
    private String description;
    private String contentType;
    private String status;
    private String projectStatus;
    private LocalDate deadline;
    private String adminFeedback;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UserSummaryDTO assignedEditor;
    private SubmissionSummaryDTO latestSubmission;

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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getProjectTitle() {
        return projectTitle;
    }

    public void setProjectTitle(String projectTitle) {
        this.projectTitle = projectTitle;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getProjectStatus() {
        return projectStatus;
    }

    public void setProjectStatus(String projectStatus) {
        this.projectStatus = projectStatus;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public String getAdminFeedback() {
        return adminFeedback;
    }

    public void setAdminFeedback(String adminFeedback) {
        this.adminFeedback = adminFeedback;
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

    public UserSummaryDTO getAssignedEditor() {
        return assignedEditor;
    }

    public void setAssignedEditor(UserSummaryDTO assignedEditor) {
        this.assignedEditor = assignedEditor;
    }

    public SubmissionSummaryDTO getLatestSubmission() {
        return latestSubmission;
    }

    public void setLatestSubmission(SubmissionSummaryDTO latestSubmission) {
        this.latestSubmission = latestSubmission;
    }

    public static class SubmissionSummaryDTO {
        private String id;
        private String status;
        private boolean stakeholderVisible;
        private String cdnUrl;
        private String fileType;
        private Integer versionNumber;
        private LocalDateTime submittedAt;
        private String adminReviewNote;
        private Integer stakeholderRating;
        private String stakeholderReview;
        private LocalDateTime stakeholderReviewedAt;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
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
    }
}
