package com.example.server.dto;

import jakarta.validation.constraints.NotBlank;

public class ReviewTaskSubmissionDTO {

    @NotBlank
    private String action;

    private String feedback;

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }
}
