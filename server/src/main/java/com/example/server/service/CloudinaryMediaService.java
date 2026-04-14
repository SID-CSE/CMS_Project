package com.example.server.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.example.server.entity.TaskSubmission;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Locale;

@Service
public class CloudinaryMediaService {

    private final Cloudinary cloudinary;
    private final String streamingProfile;
    private final long urlExpirationSeconds;

    public CloudinaryMediaService(
            Cloudinary cloudinary,
            @Value("${app.cloudinary.streaming-profile:full_hd}") String streamingProfile,
            @Value("${app.cloudinary.url-expiration-seconds:900}") long urlExpirationSeconds) {
        this.cloudinary = cloudinary;
        this.streamingProfile = streamingProfile;
        this.urlExpirationSeconds = urlExpirationSeconds;
    }

    public String buildSignedStreamUrl(TaskSubmission submission) {
        return buildSignedMediaUrl(submission);
    }

    public String buildSignedMediaUrl(TaskSubmission submission) {
        if (submission == null) {
            throw new IllegalArgumentException("Task submission is required");
        }
        String publicId = submission.getS3Key();
        if (publicId == null || publicId.isBlank()) {
            throw new IllegalArgumentException("Task submission has no media public id");
        }

        String fileType = submission.getFileType() == null ? "" : submission.getFileType().trim().toUpperCase(Locale.ROOT);
        if ("VIDEO".equals(fileType)) {
            return cloudinary.url()
                    .resourceType("video")
                    .type("upload")
                    .transformation(new Transformation<>().streamingProfile(streamingProfile))
                    .format("m3u8")
                    .signed(true)
                    .generate(publicId);
        }

        String resourceType = "image";
        if ("PDF".equals(fileType) || "DOC".equals(fileType) || "DOCX".equals(fileType) || "FILE".equals(fileType) || "RAW".equals(fileType)) {
            resourceType = "raw";
        }

        return cloudinary.url()
                .resourceType(resourceType)
                .type("upload")
                .signed(true)
            .generate(publicId);
    }

    public Instant streamUrlExpiry() {
        return Instant.now().plus(urlExpirationSeconds, ChronoUnit.SECONDS);
    }
}