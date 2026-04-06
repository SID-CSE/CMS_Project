package com.example.server.service;

import com.example.server.entity.User;
import com.example.server.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Constructor
    public DataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        log.info("Starting data seeding...");
        
        // Check if users already exist
        if (userRepository.findByRole(User.UserRole.STAKEHOLDER).isEmpty()) {
            seedInitialData();
        } else {
            log.info("Data already seeded, skipping...");
        }
    }

    private void seedInitialData() {
        log.info("Seeding initial test data...");

        // Create test users
        User stakeholder = new User();
        stakeholder.setEmail("client@contify.com");
        stakeholder.setUsername("client");
        stakeholder.setName("John Client");
        stakeholder.setRole(User.UserRole.STAKEHOLDER);
        stakeholder.setPasswordHash(passwordEncoder.encode("password123"));
        stakeholder.setIsActive(true);

        User admin = new User();
        admin.setEmail("admin@contify.com");
        admin.setUsername("admin");
        admin.setName("Alice Admin");
        admin.setRole(User.UserRole.ADMIN);
        admin.setPasswordHash(passwordEncoder.encode("password123"));
        admin.setIsActive(true);

        User editor = new User();
        editor.setEmail("editor@contify.com");
        editor.setUsername("editor");
        editor.setName("Bob Editor");
        editor.setRole(User.UserRole.EDITOR);
        editor.setPasswordHash(passwordEncoder.encode("password123"));
        editor.setIsActive(true);

        userRepository.saveAll(List.of(stakeholder, admin, editor));
        log.info("Test users created successfully");
        log.info("Stakeholder ID: {} (email: {})", stakeholder.getId(), stakeholder.getEmail());
        log.info("Admin ID: {} (email: {})", admin.getId(), admin.getEmail());
        log.info("Editor ID: {} (email: {})", editor.getId(), editor.getEmail());
        log.info("Default password for seeded users: password123");
    }
}
