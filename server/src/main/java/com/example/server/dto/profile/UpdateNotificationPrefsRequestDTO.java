package com.example.server.dto.profile;

import java.util.Map;

import jakarta.validation.constraints.NotNull;

public class UpdateNotificationPrefsRequestDTO {

    @NotNull
    private Map<String, Object> notificationPrefs;

    public Map<String, Object> getNotificationPrefs() {
        return notificationPrefs;
    }

    public void setNotificationPrefs(Map<String, Object> notificationPrefs) {
        this.notificationPrefs = notificationPrefs;
    }
}
