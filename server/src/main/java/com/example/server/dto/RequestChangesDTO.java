package com.example.server.dto;

import jakarta.validation.constraints.NotBlank;

public class RequestChangesDTO {
    
    @NotBlank(message = "Feedback cannot be blank")
    private String feedback;

    public RequestChangesDTO() {}
    public RequestChangesDTO(String feedback) { this.feedback = feedback; }
    
    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
}
