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
@RequestMapping("/api/projects")
@Validated
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ProjectRequestController {

    private static final Logger log = LoggerFactory.getLogger(ProjectRequestController.class);

    private final ProjectService projectService;

    // Constructor
    public ProjectRequestController(ProjectService projectService) {
        this.projectService = projectService;
    }

    // ===== STAGE 1: STAKEHOLDER CREATES PROJECT REQUEST =====
    @PostMapping("/request")
    public ResponseEntity<ApiResponse<ProjectRequestResponseDTO>> createProjectRequest(
            @RequestParam String clientId,
            @Valid @RequestBody CreateProjectRequestDTO dto) {
        
        log.info("POST /api/projects/request - Creating project request for client: {}", clientId);
        try {
            ProjectRequestResponseDTO result = projectService.createProjectRequest(clientId, dto);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Project request created successfully", result));
        } catch (Exception e) {
            log.error("Error creating project request: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // ===== STAKEHOLDER: LIST ALL THEIR PROJECTS =====
    @GetMapping("/client")
    public ResponseEntity<ApiResponse<List<ProjectRequestResponseDTO>>> getClientProjects(
            @RequestParam String clientId) {
        
        log.info("GET /api/projects/client - Fetching projects for client: {}", clientId);
        try {
            List<ProjectRequestResponseDTO> projects = projectService.getClientProjects(clientId);
            return ResponseEntity.ok(ApiResponse.success("Projects fetched successfully", projects));
        } catch (Exception e) {
            log.error("Error fetching client projects: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // ===== STAKEHOLDER: GET SINGLE PROJECT DETAIL =====
    @GetMapping("/{projectId}")
    public ResponseEntity<ApiResponse<ProjectRequestResponseDTO>> getProject(
            @PathVariable String projectId,
            @RequestParam String clientId) {
        
        log.info("GET /api/projects/{} - Fetching project detail for client: {}", projectId, clientId);
        try {
            ProjectRequestResponseDTO project = projectService.getProjectForClient(projectId, clientId);
            return ResponseEntity.ok(ApiResponse.success("Project fetched successfully", project));
        } catch (Exception e) {
            log.error("Error fetching project: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // ===== STAGE 2: STAKEHOLDER ACCEPTS PLAN =====
    @PatchMapping("/{projectId}/accept")
    public ResponseEntity<ApiResponse<ProjectRequestResponseDTO>> acceptPlan(
            @PathVariable String projectId,
            @RequestParam String clientId) {
        
        log.info("PATCH /api/projects/{}/accept - Client {} accepting plan", projectId, clientId);
        try {
            ProjectRequestResponseDTO result = projectService.acceptPlan(projectId, clientId);
            return ResponseEntity.ok(ApiResponse.success("Plan accepted successfully", result));
        } catch (Exception e) {
            log.error("Error accepting plan: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // ===== STAGE 3: STAKEHOLDER REQUESTS CHANGES =====
    @PatchMapping("/{projectId}/feedback")
    public ResponseEntity<ApiResponse<ProjectRequestResponseDTO>> requestChanges(
            @PathVariable String projectId,
            @RequestParam String clientId,
            @Valid @RequestBody RequestChangesDTO dto) {
        
        log.info("PATCH /api/projects/{}/feedback - Client {} requesting changes", projectId, clientId);
        try {
            ProjectRequestResponseDTO result = projectService.requestPlanChanges(projectId, clientId, dto);
            return ResponseEntity.ok(ApiResponse.success("Feedback submitted successfully", result));
        } catch (Exception e) {
            log.error("Error submitting feedback: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // ===== STAKEHOLDER: GET PROJECT PLAN =====
    @GetMapping("/{projectId}/plan")
    public ResponseEntity<ApiResponse<ProjectPlanResponseDTO>> getProjectPlan(
            @PathVariable String projectId,
            @RequestParam(required = false) String clientId) {
        try {
            ProjectPlanResponseDTO plan = projectService.getProjectPlan(projectId, clientId);
            return ResponseEntity.ok(ApiResponse.success("Plan fetched successfully", plan));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // ===== STAKEHOLDER: GET PROJECT TASKS =====
    @GetMapping("/{projectId}/tasks")
    public ResponseEntity<ApiResponse<List<TaskResponseDTO>>> getProjectTasks(
            @PathVariable String projectId,
            @RequestParam String clientId) {
        try {
            ProjectRequestResponseDTO project = projectService.getProjectForClient(projectId, clientId);
            if (project == null) {
                throw new RuntimeException("Project not found");
            }

            List<TaskResponseDTO> tasks = projectService.getProjectTasks(projectId);
            return ResponseEntity.ok(ApiResponse.success("Tasks fetched successfully", tasks));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // ===== STAGE 7: STAKEHOLDER SIGNS OFF DELIVERY =====
    @PatchMapping("/{projectId}/signoff")
    public ResponseEntity<ApiResponse<ProjectRequestResponseDTO>> signOffDelivery(
            @PathVariable String projectId,
            @RequestParam String clientId) {
        try {
            ProjectRequestResponseDTO result = projectService.signOffDelivery(projectId, clientId);
            return ResponseEntity.ok(ApiResponse.success("Project signed off successfully", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}
