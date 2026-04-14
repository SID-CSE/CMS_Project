package com.example.server.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.server.dto.AuthLoginDTO;
import com.example.server.dto.AuthRegisterDTO;
import com.example.server.dto.AuthResponseDTO;
import com.example.server.dto.UserSummaryDTO;
import com.example.server.entity.User;
import com.example.server.repository.UserRepository;
import com.example.server.security.CustomUserDetailsService;
import com.example.server.security.JwtService;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       CustomUserDetailsService userDetailsService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
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

    private AuthResponseDTO buildAuthResponse(User user, String token) {
        UserSummaryDTO summary = new UserSummaryDTO();
        summary.setId(user.getId());
        summary.setName(user.getName());
        summary.setEmail(user.getEmail());
        summary.setUsername(user.getUsername());
        summary.setRole(user.getRole().name());

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
