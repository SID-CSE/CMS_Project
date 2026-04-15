package com.example.server.dto.profile;

import java.util.List;
import java.util.Map;

public class UpdateEditorProfileRequestDTO {
    private List<String> skills;
    private List<String> contentTypes;
    private Map<String, String> portfolioLinks;
    private Integer maxConcurrentTasks;

    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }

    public List<String> getContentTypes() { return contentTypes; }
    public void setContentTypes(List<String> contentTypes) { this.contentTypes = contentTypes; }

    public Map<String, String> getPortfolioLinks() { return portfolioLinks; }
    public void setPortfolioLinks(Map<String, String> portfolioLinks) { this.portfolioLinks = portfolioLinks; }

    public Integer getMaxConcurrentTasks() { return maxConcurrentTasks; }
    public void setMaxConcurrentTasks(Integer maxConcurrentTasks) { this.maxConcurrentTasks = maxConcurrentTasks; }
}
