package com.example.server.dto.profile;

import jakarta.validation.constraints.Size;

public class UpdateSharedProfileRequestDTO {

    @Size(max = 120)
    private String displayName;

    @Size(max = 32)
    private String phone;

    @Size(max = 100)
    private String jobTitle;

    @Size(max = 100)
    private String department;

    @Size(max = 200)
    private String bio;

    @Size(max = 64)
    private String timezone;

    @Size(max = 16)
    private String language;

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getTimezone() { return timezone; }
    public void setTimezone(String timezone) { this.timezone = timezone; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
}
