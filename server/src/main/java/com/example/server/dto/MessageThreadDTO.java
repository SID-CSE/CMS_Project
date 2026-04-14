package com.example.server.dto;

import java.time.LocalDateTime;

public class MessageThreadDTO {
    private String counterpartId;
    private UserSummaryDTO counterpart;
    private String projectId;
    private String projectTitle;
    private String lastMessage;
    private LocalDateTime lastMessageAt;
    private long unreadCount;

    public String getCounterpartId() { return counterpartId; }
    public void setCounterpartId(String counterpartId) { this.counterpartId = counterpartId; }
    public UserSummaryDTO getCounterpart() { return counterpart; }
    public void setCounterpart(UserSummaryDTO counterpart) { this.counterpart = counterpart; }
    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }
    public String getProjectTitle() { return projectTitle; }
    public void setProjectTitle(String projectTitle) { this.projectTitle = projectTitle; }
    public String getLastMessage() { return lastMessage; }
    public void setLastMessage(String lastMessage) { this.lastMessage = lastMessage; }
    public LocalDateTime getLastMessageAt() { return lastMessageAt; }
    public void setLastMessageAt(LocalDateTime lastMessageAt) { this.lastMessageAt = lastMessageAt; }
    public long getUnreadCount() { return unreadCount; }
    public void setUnreadCount(long unreadCount) { this.unreadCount = unreadCount; }
}