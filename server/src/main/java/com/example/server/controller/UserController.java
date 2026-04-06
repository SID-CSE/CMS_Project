package com.example.server.controller;

import com.example.server.dto.ApiResponse;
import com.example.server.dto.UserSummaryDTO;
import com.example.server.entity.User;
import com.example.server.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/editors")
    public ResponseEntity<ApiResponse<List<UserSummaryDTO>>> getEditors() {
        List<UserSummaryDTO> editors = userRepository.findByRole(User.UserRole.EDITOR)
                .stream()
                .map(user -> {
                    UserSummaryDTO dto = new UserSummaryDTO();
                    dto.setId(user.getId());
                    dto.setName(user.getName());
                    dto.setEmail(user.getEmail());
                    dto.setUsername(user.getUsername());
                    dto.setRole(user.getRole().name());
                    return dto;
                })
                .toList();

        return ResponseEntity.ok(ApiResponse.success("Editors fetched", editors));
    }
}
