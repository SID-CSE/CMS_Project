package com.example.server.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class ProjectPlanResponseDTO {
    
    private String id;
    private String projectId;
    
    @JsonProperty("admin")
    private UserSummaryDTO admin;
    
    private LocalDate timelineStart;
    private LocalDate timelineEnd;
    private String notes;
    private List<MilestoneSummaryDTO> milestones;
    
    private LocalDateTime sentAt;
    private LocalDateTime acceptedAt;
    private String clientFeedback;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public ProjectPlanResponseDTO() {
    }
    
    public ProjectPlanResponseDTO(String id, String projectId, UserSummaryDTO admin, LocalDate timelineStart, LocalDate timelineEnd, String notes, List<MilestoneSummaryDTO> milestones, LocalDateTime sentAt, LocalDateTime acceptedAt, String clientFeedback, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.projectId = projectId;
        this.admin = admin;
        this.timelineStart = timelineStart;
        this.timelineEnd = timelineEnd;
        this.notes = notes;
        this.milestones = milestones;
        this.sentAt = sentAt;
        this.acceptedAt = acceptedAt;
        this.clientFeedback = clientFeedback;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
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
    
    public UserSummaryDTO getAdmin() {
        return admin;
    }
    
    public void setAdmin(UserSummaryDTO admin) {
        this.admin = admin;
    }
    
    public LocalDate getTimelineStart() {
        return timelineStart;
    }
    
    public void setTimelineStart(LocalDate timelineStart) {
        this.timelineStart = timelineStart;
    }
    
    public LocalDate getTimelineEnd() {
        return timelineEnd;
    }
    
    public void setTimelineEnd(LocalDate timelineEnd) {
        this.timelineEnd = timelineEnd;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
    
    public List<MilestoneSummaryDTO> getMilestones() {
        return milestones;
    }
    
    public void setMilestones(List<MilestoneSummaryDTO> milestones) {
        this.milestones = milestones;
    }
    
    public LocalDateTime getSentAt() {
        return sentAt;
    }
    
    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }
    
    public LocalDateTime getAcceptedAt() {
        return acceptedAt;
    }
    
    public void setAcceptedAt(LocalDateTime acceptedAt) {
        this.acceptedAt = acceptedAt;
    }
    
    public String getClientFeedback() {
        return clientFeedback;
    }
    
    public void setClientFeedback(String clientFeedback) {
        this.clientFeedback = clientFeedback;
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
    
    public static class MilestoneSummaryDTO {
        private String id;
        private String title;
        private LocalDate dueDate;
        private Integer orderIndex;
        
        public MilestoneSummaryDTO() {
        }
        
        public MilestoneSummaryDTO(String id, String title, LocalDate dueDate, Integer orderIndex) {
            this.id = id;
            this.title = title;
            this.dueDate = dueDate;
            this.orderIndex = orderIndex;
        }
        
        public String getId() {
            return id;
        }
        
        public void setId(String id) {
            this.id = id;
        }
        
        public String getTitle() {
            return title;
        }
        
        public void setTitle(String title) {
            this.title = title;
        }
        
        public LocalDate getDueDate() {
            return dueDate;
        }
        
        public void setDueDate(LocalDate dueDate) {
            this.dueDate = dueDate;
        }
        
        public Integer getOrderIndex() {
            return orderIndex;
        }
        
        public void setOrderIndex(Integer orderIndex) {
            this.orderIndex = orderIndex;
        }
    }
}
