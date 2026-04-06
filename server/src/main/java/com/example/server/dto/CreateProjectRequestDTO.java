package com.example.server.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public class CreateProjectRequestDTO {
    
    @NotBlank(message = "Title cannot be blank")
    private String title;
    
    @NotBlank(message = "Description cannot be blank")
    private String description;
    
    @NotEmpty(message = "Content types cannot be empty")
    private List<String> contentTypes; // VIDEO, IMAGE, DESIGN, COPY
    
    @NotNull(message = "Deadline cannot be null")
    private LocalDate deadline;
    
    public CreateProjectRequestDTO() {
    }
    
    public CreateProjectRequestDTO(String title, String description, List<String> contentTypes, LocalDate deadline) {
        this.title = title;
        this.description = description;
        this.contentTypes = contentTypes;
        this.deadline = deadline;
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
}
