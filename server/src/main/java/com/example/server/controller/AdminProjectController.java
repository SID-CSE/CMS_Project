package com.example.server.controller;

import com.example.server.dto.*;
import com.example.server.service.ProjectService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@Validated
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AdminProjectController {

    private static final Logger log = LoggerFactory.getLogger(AdminProjectController.class);

    private final ProjectService projectService;

    // Constructor
    public AdminProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    // ===== ADMIN: GET ALL NEW REQUESTS =====
    @GetMapping("/requests")
    public ResponseEntity<ApiResponse<List<ProjectRequestResponseDTO>>> getNewRequests() {
        log.info("GET /api/admin/requests - Fetching all new project requests");
        try {
            List<ProjectRequestResponseDTO> requests = projectService.getNewRequests();
            return ResponseEntity.ok(ApiResponse.success("New requests fetched successfully", requests));
        } catch (Exception e) {
            log.error("Error fetching new requests: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // ===== ADMIN: GET SINGLE REQUEST DETAIL =====
    @GetMapping("/projects/{projectId}")
    public ResponseEntity<ApiResponse<ProjectRequestResponseDTO>> getProjectDetail(
            @PathVariable String projectId) {
        
        log.info("GET /api/admin/projects/{} - Fetching project detail", projectId);
        try {
            ProjectRequestResponseDTO request = projectService.getProjectForClient(projectId, null);
            return ResponseEntity.ok(ApiResponse.success("Request detail fetched successfully", request));
        } catch (Exception e) {
            log.error("Error fetching request detail: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // ===== ADMIN: CREATE PROJECT PLAN =====
    @PostMapping("/projects/{projectId}/plan")
    public ResponseEntity<ApiResponse<ProjectPlanResponseDTO>> createProjectPlan(
            @PathVariable String projectId,
            @RequestParam String adminId,
            @Valid @RequestBody CreateProjectPlanDTO dto) {
        
        log.info("POST /api/admin/projects/{}/plan - Creating plan by admin: {}", projectId, adminId);
        try {
            ProjectPlanResponseDTO result = projectService.createProjectPlan(projectId, adminId, dto);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Project plan created successfully", result));
        } catch (Exception e) {
            log.error("Error creating project plan: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // ===== ADMIN: SEND PLAN TO CLIENT =====
    @PatchMapping("/projects/{projectId}/plan/send")
    public ResponseEntity<ApiResponse<ProjectPlanResponseDTO>> sendPlanToClient(
            @PathVariable String projectId,
            @RequestParam String adminId) {
        
        log.info("PATCH /api/admin/projects/{}/plan/send - Sending plan to client by admin: {}", projectId, adminId);
        try {
            ProjectPlanResponseDTO result = projectService.sendPlanToClient(projectId, adminId);
            return ResponseEntity.ok(ApiResponse.success("Plan sent to client successfully", result));
        } catch (Exception e) {
            log.error("Error sending plan to client: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // ===== STAGE 4: ADMIN CREATES TASK =====
    @PostMapping("/projects/{projectId}/tasks")
    public ResponseEntity<ApiResponse<TaskResponseDTO>> createTask(
            @PathVariable String projectId,
            @RequestParam String adminId,
            @Valid @RequestBody CreateTaskDTO dto) {
        try {
            TaskResponseDTO result = projectService.createTask(projectId, adminId, dto);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Task created successfully", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/projects/{projectId}/tasks")
    public ResponseEntity<ApiResponse<List<TaskResponseDTO>>> getProjectTasks(@PathVariable String projectId) {
        try {
            List<TaskResponseDTO> tasks = projectService.getProjectTasks(projectId);
            return ResponseEntity.ok(ApiResponse.success("Project tasks fetched successfully", tasks));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // ===== STAGE 6: ADMIN REVIEWS SUBMISSION =====
    @PatchMapping("/tasks/{taskId}/review")
    public ResponseEntity<ApiResponse<TaskResponseDTO>> reviewTask(
            @PathVariable String taskId,
            @RequestParam String adminId,
            @Valid @RequestBody ReviewTaskSubmissionDTO dto) {
        try {
            TaskResponseDTO result = projectService.reviewTask(taskId, adminId, dto);
            return ResponseEntity.ok(ApiResponse.success("Task review updated", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}
