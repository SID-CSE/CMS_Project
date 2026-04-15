package com.example.server.dto.profile;

import java.util.List;
import java.util.Map;

public class UserMeResponseDTO {
    private String id;
    private String email;
    private String username;
    private String role;
    private String fullName;
    private String displayName;
    private String phone;
    private String jobTitle;
    private String department;
    private String bio;
    private String timezone;
    private String language;
    private String avatarUrl;
    private Map<String, Object> notificationPrefs;
    private List<String> skills;
    private List<String> contentTypes;
    private Map<String, String> portfolioLinks;
    private Integer maxConcurrentTasks;
    private String companyName;
    private String industry;
    private String website;
    private String gstNumber;
    private Map<String, String> brandColors;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

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

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public Map<String, Object> getNotificationPrefs() { return notificationPrefs; }
    public void setNotificationPrefs(Map<String, Object> notificationPrefs) { this.notificationPrefs = notificationPrefs; }

    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }

    public List<String> getContentTypes() { return contentTypes; }
    public void setContentTypes(List<String> contentTypes) { this.contentTypes = contentTypes; }

    public Map<String, String> getPortfolioLinks() { return portfolioLinks; }
    public void setPortfolioLinks(Map<String, String> portfolioLinks) { this.portfolioLinks = portfolioLinks; }

    public Integer getMaxConcurrentTasks() { return maxConcurrentTasks; }
    public void setMaxConcurrentTasks(Integer maxConcurrentTasks) { this.maxConcurrentTasks = maxConcurrentTasks; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }

    public String getGstNumber() { return gstNumber; }
    public void setGstNumber(String gstNumber) { this.gstNumber = gstNumber; }

    public Map<String, String> getBrandColors() { return brandColors; }
    public void setBrandColors(Map<String, String> brandColors) { this.brandColors = brandColors; }
}
