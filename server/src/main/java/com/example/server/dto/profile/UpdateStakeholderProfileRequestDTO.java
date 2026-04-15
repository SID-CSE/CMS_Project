package com.example.server.dto.profile;

import java.util.Map;

import jakarta.validation.constraints.Size;

public class UpdateStakeholderProfileRequestDTO {

    @Size(max = 160)
    private String companyName;

    @Size(max = 255)
    private String website;

    private Map<String, String> brandColors;

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }

    public Map<String, String> getBrandColors() { return brandColors; }
    public void setBrandColors(Map<String, String> brandColors) { this.brandColors = brandColors; }
}
