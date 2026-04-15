package com.example.server.dto.profile;

import java.util.Map;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class UpdateAdminProfileRequestDTO {

    @Size(max = 160)
    private String companyName;

    @Size(max = 120)
    private String industry;

    @Size(max = 255)
    private String website;

    @Pattern(regexp = "^$|^[A-Za-z0-9]{15}$", message = "GST number must be 15 characters")
    private String gstNumber;

    private Map<String, String> brandColors;

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
