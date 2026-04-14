package com.example.server.dto;

import java.math.BigDecimal;

public class FinanceProjectDTO {
    private String projectId;
    private String projectTitle;
    private String stakeholderId;
    private String stakeholderName;
    private String projectStatus;
    private long taskCount;
    private long submittedTaskCount;
    private String latestFinanceStatus;

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getProjectTitle() {
        return projectTitle;
    }

    public void setProjectTitle(String projectTitle) {
        this.projectTitle = projectTitle;
    }

    public String getStakeholderId() {
        return stakeholderId;
    }

    public void setStakeholderId(String stakeholderId) {
        this.stakeholderId = stakeholderId;
    }

    public String getStakeholderName() {
        return stakeholderName;
    }

    public void setStakeholderName(String stakeholderName) {
        this.stakeholderName = stakeholderName;
    }

    public String getProjectStatus() {
        return projectStatus;
    }

    public void setProjectStatus(String projectStatus) {
        this.projectStatus = projectStatus;
    }

    public long getTaskCount() {
        return taskCount;
    }

    public void setTaskCount(long taskCount) {
        this.taskCount = taskCount;
    }

    public long getSubmittedTaskCount() {
        return submittedTaskCount;
    }

    public void setSubmittedTaskCount(long submittedTaskCount) {
        this.submittedTaskCount = submittedTaskCount;
    }

    public String getLatestFinanceStatus() {
        return latestFinanceStatus;
    }

    public void setLatestFinanceStatus(String latestFinanceStatus) {
        this.latestFinanceStatus = latestFinanceStatus;
    }
}
