package com.example.server.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "reference_files")
public class ReferenceFile {

    @Id
    @Column(columnDefinition = "CHAR(36)")
    private String id;

    @Column(name = "project_id", nullable = false, columnDefinition = "CHAR(36)")
    private String projectId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "project_id", insertable = false, updatable = false)
    private ProjectRequest project;

    @Column(name = "uploaded_by", nullable = false, columnDefinition = "CHAR(36)")
    private String uploadedBy;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "uploaded_by", insertable = false, updatable = false)
    private User uploader;

    @Column(name = "s3_key")
    private String s3Key;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "file_type")
    private String fileType;

    @Column(name = "uploaded_at", nullable = false)
    private LocalDateTime uploadedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public ReferenceFile() {
    }

    public ReferenceFile(String id, String projectId, ProjectRequest project, String uploadedBy, User uploader, String s3Key, String fileName, String fileType, LocalDateTime uploadedAt, LocalDateTime createdAt) {
        this.id = id;
        this.projectId = projectId;
        this.project = project;
        this.uploadedBy = uploadedBy;
        this.uploader = uploader;
        this.s3Key = s3Key;
        this.fileName = fileName;
        this.fileType = fileType;
        this.uploadedAt = uploadedAt;
        this.createdAt = createdAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public ProjectRequest getProject() {
        return project;
    }

    public void setProject(ProjectRequest project) {
        this.project = project;
    }

    public String getUploadedBy() {
        return uploadedBy;
    }

    public void setUploadedBy(String uploadedBy) {
        this.uploadedBy = uploadedBy;
    }

    public User getUploader() {
        return uploader;
    }

    public void setUploader(User uploader) {
        this.uploader = uploader;
    }

    public String getS3Key() {
        return s3Key;
    }

    public void setS3Key(String s3Key) {
        this.s3Key = s3Key;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        this.id = UUID.randomUUID().toString();
        this.uploadedAt = LocalDateTime.now();
        this.createdAt = LocalDateTime.now();
    }
}
