package com.example.server.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public class CreateProjectPlanDTO {
    
    @NotNull(message = "Timeline start date cannot be null")
    private LocalDate timelineStart;
    
    @NotNull(message = "Timeline end date cannot be null")
    private LocalDate timelineEnd;
    
    @NotBlank(message = "Notes cannot be blank")
    private String notes;
    
    @NotNull(message = "Milestones cannot be null")
    private List<MilestoneDTO> milestones;
    
    public CreateProjectPlanDTO() {
    }
    
    public CreateProjectPlanDTO(LocalDate timelineStart, LocalDate timelineEnd, String notes, List<MilestoneDTO> milestones) {
        this.timelineStart = timelineStart;
        this.timelineEnd = timelineEnd;
        this.notes = notes;
        this.milestones = milestones;
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
    
    public List<MilestoneDTO> getMilestones() {
        return milestones;
    }
    
    public void setMilestones(List<MilestoneDTO> milestones) {
        this.milestones = milestones;
    }
    
    public static class MilestoneDTO {
        @NotBlank(message = "Milestone title cannot be blank")
        private String title;
        
        @NotNull(message = "Milestone due date cannot be null")
        private LocalDate dueDate;
        
        @NotNull(message = "Milestone order index cannot be null")
        private Integer orderIndex;
        
        public MilestoneDTO() {
        }
        
        public MilestoneDTO(String title, LocalDate dueDate, Integer orderIndex) {
            this.title = title;
            this.dueDate = dueDate;
            this.orderIndex = orderIndex;
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
