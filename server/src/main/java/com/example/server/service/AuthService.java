package com.example.server.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.server.dto.AuthLoginDTO;
import com.example.server.dto.AuthRegisterDTO;
import com.example.server.dto.AuthResponseDTO;
import com.example.server.dto.UserSummaryDTO;
import com.example.server.entity.PasswordResetToken;
import com.example.server.entity.User;
import com.example.server.repository.PasswordResetTokenRepository;
import com.example.server.repository.UserRepository;
import com.example.server.security.CustomUserDetailsService;
import com.example.server.security.JwtService;

@Service
public class AuthService {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final JavaMailSender mailSender;

    @Value("${app.frontend.base-url:http://localhost:5173}")
    private String frontendBaseUrl;

    @Value("${app.mail.from:no-reply@contify.local}")
    private String fromEmail;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       CustomUserDetailsService userDetailsService,
                       PasswordResetTokenRepository passwordResetTokenRepository,
                       JavaMailSender mailSender) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.mailSender = mailSender;
    }

    public AuthResponseDTO register(AuthRegisterDTO dto) {
        String email = dto.getEmail().trim().toLowerCase();
        String username = dto.getUsername().trim().toLowerCase();
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username already taken");
        }

        User user = new User();
        user.setEmail(email);
        user.setUsername(username);
        user.setName(dto.getName().trim());
        user.setRole(parseRole(dto.getRole()));
        user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        user.setIsActive(true);

        User savedUser = userRepository.save(user);
        UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getEmail());
        String token = jwtService.generateToken(userDetails);

        return buildAuthResponse(savedUser, token);
    }

    public AuthResponseDTO login(AuthLoginDTO dto) {
        String email = dto.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new RuntimeException("User account is inactive");
        }

        if (!passwordEncoder.matches(dto.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails);

        return buildAuthResponse(user, token);
    }

    @Transactional
    public void forgotPassword(String emailValue) {
        String email = (emailValue == null ? "" : emailValue.trim().toLowerCase());
        if (email.isEmpty()) {
            return;
        }

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return;
        }

        passwordResetTokenRepository.deleteByExpiresAtBefore(LocalDateTime.now());
        passwordResetTokenRepository.deleteByUser(user);

        PasswordResetToken tokenEntity = new PasswordResetToken();
        tokenEntity.setUser(user);
        tokenEntity.setToken(generateSecureToken());
        tokenEntity.setExpiresAt(LocalDateTime.now().plusMinutes(30));
        passwordResetTokenRepository.save(tokenEntity);

        String resetUrl = frontendBaseUrl + "/reset-password?token=" + tokenEntity.getToken();
        sendPasswordResetEmail(user.getEmail(), resetUrl);
    }

    @Transactional
    public void resetPassword(String tokenValue, String newPassword) {
        String token = tokenValue == null ? "" : tokenValue.trim();
        if (token.isEmpty()) {
            throw new RuntimeException("Invalid reset token.");
        }

        PasswordResetToken tokenEntity = passwordResetTokenRepository
                .findByTokenAndUsedAtIsNull(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired reset token."));

        if (tokenEntity.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Reset token has expired.");
        }

        User user = tokenEntity.getUser();
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        tokenEntity.setUsedAt(LocalDateTime.now());
        passwordResetTokenRepository.save(tokenEntity);
    }

    private String generateSecureToken() {
        byte[] randomBytes = new byte[32];
        SECURE_RANDOM.nextBytes(randomBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }

    private void sendPasswordResetEmail(String toEmail, String resetUrl) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Contify Password Reset");
        message.setText("""
            We received a request to reset your Contify password.

            Use this link to set a new password (valid for 30 minutes):
            %s

            If you did not request this, you can ignore this email.
            """.formatted(resetUrl));
        mailSender.send(message);
    }

    private AuthResponseDTO buildAuthResponse(User user, String token) {
        UserSummaryDTO summary = new UserSummaryDTO();
        summary.setId(user.getId());
        summary.setName(user.getName());
        summary.setEmail(user.getEmail());
        summary.setUsername(user.getUsername());
        summary.setRole(user.getRole().name());
        summary.setProfileImage(user.getProfileImage());
        summary.setTeam(user.getTeam());

        AuthResponseDTO response = new AuthResponseDTO();
        response.setToken(token);
        response.setUser(summary);
        return response;
    }

    private User.UserRole parseRole(String roleValue) {
        String normalized = (roleValue == null ? "" : roleValue.trim()).toUpperCase();
        if ("CREATOR".equals(normalized)) {
            normalized = "EDITOR";
        } else if ("MANAGER".equals(normalized)) {
            normalized = "ADMIN";
        } else if ("CLIENT".equals(normalized)) {
            normalized = "STAKEHOLDER";
        }

        try {
            return User.UserRole.valueOf(normalized);
        } catch (Exception ex) {
            throw new RuntimeException("Invalid role: " + roleValue);
        }
    }
}
