package com.example.server.dto;

import jakarta.validation.constraints.NotBlank;

public class SubmitTaskDTO {

    @NotBlank
    private String cdnUrl;

    @NotBlank
    private String fileType;

    private String s3Key;

    public String getCdnUrl() {
        return cdnUrl;
    }

    public void setCdnUrl(String cdnUrl) {
        this.cdnUrl = cdnUrl;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public String getS3Key() {
        return s3Key;
    }

    public void setS3Key(String s3Key) {
        this.s3Key = s3Key;
    }
}
