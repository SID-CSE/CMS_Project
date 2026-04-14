package com.example.server.config;

import com.cloudinary.Cloudinary;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    private static final Logger logger = LoggerFactory.getLogger(CloudinaryConfig.class);

    @Bean
    public Cloudinary cloudinary(
            @Value("${app.cloudinary.cloud-name:}") String cloudName,
            @Value("${app.cloudinary.api-key:}") String apiKey,
            @Value("${app.cloudinary.api-secret:}") String apiSecret) {

        cloudName = cloudName == null ? "" : cloudName.trim();
        apiKey = apiKey == null ? "" : apiKey.trim();
        apiSecret = apiSecret == null ? "" : apiSecret.trim();

        // Validate that required properties are set
        if (cloudName.isEmpty()) {
            logger.warn("⚠️ CLOUDINARY_CLOUD_NAME is not configured. Set 'app.cloudinary.cloud-name' in application.properties or env variables.");
        }
        if (apiKey.isEmpty()) {
            logger.warn("⚠️ CLOUDINARY_API_KEY is not configured. Set 'app.cloudinary.api-key' in application.properties or env variables.");
        }
        if (apiSecret.isEmpty()) {
            logger.warn("⚠️ CLOUDINARY_API_SECRET is not configured. Set 'app.cloudinary.api-secret' in application.properties or env variables.");
        }

        Map<String, Object> config = new HashMap<>();
        config.put("cloud_name", cloudName);
        config.put("api_key", apiKey);
        config.put("api_secret", apiSecret);
        config.put("secure", true);
        config.put("load_strategies", false);

        if (!cloudName.isEmpty() && !apiKey.isEmpty() && !apiSecret.isEmpty()) {
            logger.info("✅ Cloudinary configured successfully");
        } else {
            logger.warn("❌ Cloudinary configuration incomplete - file uploads will fail");
        }

        return new Cloudinary(config);
    }
}
