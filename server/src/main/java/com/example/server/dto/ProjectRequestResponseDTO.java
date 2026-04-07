package com.example.server.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class ProjectRequestResponseDTO {
    
    private String id;
    private String title;
    private String description;
    private List<String> contentTypes;
    private LocalDate deadline;
    private String status;
    
    @JsonProperty("client")
    private UserSummaryDTO client;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public ProjectRequestResponseDTO() {
    }
    
    public ProjectRequestResponseDTO(String id, String title, String description, List<String> contentTypes, LocalDate deadline, String status, UserSummaryDTO client, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.contentTypes = contentTypes;
        this.deadline = deadline;
        this.status = status;
        this.client = client;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
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
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public List<String> getContentTypes() {
        return contentTypes;
    }
    
    public void setContentTypes(List<String> contentTypes) {
        this.contentTypes = contentTypes;
    }
    
    public LocalDate getDeadline() {
        return deadline;
    }
    
    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public UserSummaryDTO getClient() {
        return client;
    }
    
    public void setClient(UserSummaryDTO client) {
        this.client = client;
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
}
