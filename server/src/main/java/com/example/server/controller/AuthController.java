package com.example.server.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.server.dto.ApiResponse;
import com.example.server.dto.AuthLoginDTO;
import com.example.server.dto.AuthRegisterDTO;
import com.example.server.dto.AuthResponseDTO;
import com.example.server.dto.ForgotPasswordRequestDTO;
import com.example.server.dto.ResetPasswordDTO;
import com.example.server.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> register(@Valid @RequestBody AuthRegisterDTO dto) {
        try {
            AuthResponseDTO response = authService.register(dto);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Registration successful", response));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(ex.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> login(@Valid @RequestBody AuthLoginDTO dto) {
        try {
            AuthResponseDTO response = authService.login(dto);
            return ResponseEntity.ok(ApiResponse.success("Login successful", response));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(ex.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@Valid @RequestBody ForgotPasswordRequestDTO dto) {
        authService.forgotPassword(dto.getEmail());
        return ResponseEntity.ok(ApiResponse.success(
                "If an account exists for this email, reset instructions have been sent.",
                null
        ));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordDTO dto) {
        try {
            authService.resetPassword(dto.getToken(), dto.getPassword());
            return ResponseEntity.ok(ApiResponse.success("Password has been reset successfully.", null));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error(ex.getMessage()));
        }
    }
}
