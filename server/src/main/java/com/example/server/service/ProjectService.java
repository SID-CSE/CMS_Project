package com.example.server.service;

import com.example.server.entity.*;
import com.example.server.repository.*;
import com.example.server.dto.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    private static final Logger log = LoggerFactory.getLogger(ProjectService.class);

    private final ProjectRequestRepository projectRequestRepository;
    private final ProjectPlanRepository projectPlanRepository;
    private final PlanMilestoneRepository planMilestoneRepository;
    private final TaskRepository taskRepository;
    private final TaskSubmissionRepository taskSubmissionRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    // Constructor
    public ProjectService(ProjectRequestRepository projectRequestRepository,
                          ProjectPlanRepository projectPlanRepository,
                          PlanMilestoneRepository planMilestoneRepository,
                          TaskRepository taskRepository,
                          TaskSubmissionRepository taskSubmissionRepository,
                          NotificationRepository notificationRepository,
                          UserRepository userRepository,
                          ObjectMapper objectMapper) {
        this.projectRequestRepository = projectRequestRepository;
        this.projectPlanRepository = projectPlanRepository;
        this.planMilestoneRepository = planMilestoneRepository;
        this.taskRepository = taskRepository;
        this.taskSubmissionRepository = taskSubmissionRepository;
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
    }

    // ===== STAGE 1: STAKEHOLDER POSTS PROJECT REQUEST =====
    @Transactional
    public ProjectRequestResponseDTO createProjectRequest(String clientId, CreateProjectRequestDTO dto) {
        log.info("Creating project request for client: {}", clientId);

        // Verify client exists
        User client = userRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found with id: " + clientId));

        // Create project request
        ProjectRequest projectRequest = new ProjectRequest();
        projectRequest.setClientId(clientId);
        projectRequest.setClient(client);
        projectRequest.setTitle(dto.getTitle());
        projectRequest.setDescription(dto.getDescription());
        
        // Convert content types list to JSON string
        try {
            projectRequest.setContentTypes(objectMapper.writeValueAsString(dto.getContentTypes()));
        } catch (Exception e) {
            log.error("Failed to serialize content types", e);
            throw new RuntimeException("Failed to process content types");
        }
        
        projectRequest.setDeadline(dto.getDeadline());
        projectRequest.setStatus(ProjectRequest.ProjectStatus.REQUESTED);

        ProjectRequest savedRequest = projectRequestRepository.save(projectRequest);
        log.info("Project request created with id: {}", savedRequest.getId());

        // Notify all admins
        notifyAdminsNewRequest(savedRequest);

        return mapToResponseDTO(savedRequest);
    }

    // ===== STAGE 2: ADMIN BUILDS PROJECT PLAN =====
    @Transactional
    public ProjectPlanResponseDTO createProjectPlan(String projectId, String adminId, CreateProjectPlanDTO dto) {
        log.info("Creating project plan for project: {} by admin: {}", projectId, adminId);

        // Verify project exists and is in REQUESTED status
        ProjectRequest project = projectRequestRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));

        if (!project.getStatus().equals(ProjectRequest.ProjectStatus.REQUESTED)) {
            throw new RuntimeException("Project must be in REQUESTED status to create a plan");
        }

        // Verify admin exists
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found with id: " + adminId));

        // Create project plan
        ProjectPlan plan = new ProjectPlan();
        plan.setProjectId(projectId);
        plan.setProject(project);
        plan.setCreatedBy(adminId);
        plan.setAdmin(admin);
        plan.setTimelineStart(dto.getTimelineStart());
        plan.setTimelineEnd(dto.getTimelineEnd());
        plan.setNotes(dto.getNotes());

        ProjectPlan savedPlan = projectPlanRepository.save(plan);
        log.info("Project plan created with id: {}", savedPlan.getId());

        // Create milestones
        List<PlanMilestone> milestones = dto.getMilestones().stream()
                .map(m -> {
                    PlanMilestone milestone = new PlanMilestone();
                    milestone.setPlanId(savedPlan.getId());
                    milestone.setPlan(savedPlan);
                    milestone.setTitle(m.getTitle());
                    milestone.setDueDate(m.getDueDate());
                    milestone.setOrderIndex(m.getOrderIndex());
                    return milestone;
                })
                .collect(Collectors.toList());

        planMilestoneRepository.saveAll(milestones);
        savedPlan.setMilestones(milestones);
        
        log.info("Created {} milestones for plan: {}", milestones.size(), savedPlan.getId());

        return mapPlanToResponseDTO(savedPlan);
    }

    // ===== SEND PLAN TO CLIENT =====
    @Transactional
    public ProjectPlanResponseDTO sendPlanToClient(String projectId, String adminId) {
        log.info("Sending plan to client for project: {}", projectId);

        ProjectRequest project = projectRequestRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));

        ProjectPlan plan = projectPlanRepository.findByProjectId(projectId)
                .orElseThrow(() -> new RuntimeException("Plan not found for project: " + projectId));

        // Update plan sent_at timestamp
        plan.setSentAt(LocalDateTime.now());
        projectPlanRepository.save(plan);

        // Update project status to PLAN_SENT
        project.setStatus(ProjectRequest.ProjectStatus.PLAN_SENT);
        projectRequestRepository.save(project);
        
        log.info("Plan sent to client for project: {}", projectId);

        // Notify stakeholder of plan sent
        notifyStakeholderPlanSent(project, plan);

        return mapPlanToResponseDTO(plan);
    }

    // ===== STAKEHOLDER ACCEPTS PLAN =====
    @Transactional
    public ProjectRequestResponseDTO acceptPlan(String projectId, String clientId) {
        log.info("Client {} accepting plan for project: {}", clientId, projectId);

        ProjectRequest project = projectRequestRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));

        if (!project.getClientId().equals(clientId)) {
            throw new RuntimeException("Unauthorized: You are not the client for this project");
        }

        if (!project.getStatus().equals(ProjectRequest.ProjectStatus.PLAN_SENT)) {
            throw new RuntimeException("Project must be in PLAN_SENT status to accept plan");
        }

        ProjectPlan plan = projectPlanRepository.findByProjectId(projectId)
                .orElseThrow(() -> new RuntimeException("Plan not found for project: " + projectId));

        // Update statuses
        plan.setAcceptedAt(LocalDateTime.now());
        projectPlanRepository.save(plan);

        project.setStatus(ProjectRequest.ProjectStatus.IN_PROGRESS);
        projectRequestRepository.save(project);
        
        log.info("Plan accepted for project: {}", projectId);

        // Notify admin that plan was accepted
        notifyAdminPlanAccepted(project);

        return mapToResponseDTO(project);
    }

    // ===== STAKEHOLDER REQUESTS CHANGES =====
    @Transactional
    public ProjectRequestResponseDTO requestPlanChanges(String projectId, String clientId, RequestChangesDTO dto) {
        log.info("Client {} requesting changes for project: {}", clientId, projectId);

        ProjectRequest project = projectRequestRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));

        if (!project.getClientId().equals(clientId)) {
            throw new RuntimeException("Unauthorized: You are not the client for this project");
        }

        if (!project.getStatus().equals(ProjectRequest.ProjectStatus.PLAN_SENT)) {
            throw new RuntimeException("Project must be in PLAN_SENT status to request changes");
        }

        ProjectPlan plan = projectPlanRepository.findByProjectId(projectId)
                .orElseThrow(() -> new RuntimeException("Plan not found for project: " + projectId));

        // Store client feedback
        plan.setClientFeedback(dto.getFeedback());
        projectPlanRepository.save(plan);

        // Keep project status as PLAN_SENT, don't change it
        log.info("Change request recorded for project: {}", projectId);

        // Notify admin of change request
        notifyAdminRequestChanges(project);

        return mapToResponseDTO(project);
    }

    // ===== GET PROJECT DETAILS FOR CLIENT =====
    public ProjectRequestResponseDTO getProjectForClient(String projectId, String clientId) {
        log.info("Fetching project {} for client {}", projectId, clientId);

        ProjectRequest project = projectRequestRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));

        if (clientId != null && !project.getClientId().equals(clientId)) {
            throw new RuntimeException("Unauthorized: You are not the client for this project");
        }

        return mapToResponseDTO(project);
    }

    // ===== GET ALL CLIENT PROJECTS =====
    public List<ProjectRequestResponseDTO> getClientProjects(String clientId) {
        log.info("Fetching all projects for client: {}", clientId);
        return projectRequestRepository.findByClientId(clientId).stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // ===== GET ALL NEW REQUESTS FOR ADMIN =====
    public List<ProjectRequestResponseDTO> getNewRequests() {
        log.info("Fetching all new project requests");
        return projectRequestRepository.findByStatus(ProjectRequest.ProjectStatus.REQUESTED).stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // ===== GET PROJECT PLAN =====
    public ProjectPlanResponseDTO getProjectPlan(String projectId, String clientId) {
        ProjectRequest project = projectRequestRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));

        if (clientId != null && !project.getClientId().equals(clientId)) {
            throw new RuntimeException("Unauthorized: You are not the client for this project");
        }

        ProjectPlan plan = projectPlanRepository.findByProjectId(projectId)
                .orElseThrow(() -> new RuntimeException("Plan not found for project: " + projectId));

        return mapPlanToResponseDTO(plan);
    }

    // ===== STAGE 4: ADMIN CREATES TASKS =====
    @Transactional
    public TaskResponseDTO createTask(String projectId, String adminId, CreateTaskDTO dto) {
        ProjectRequest project = projectRequestRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found with id: " + adminId));
        if (admin.getRole() != User.UserRole.ADMIN) {
            throw new RuntimeException("Only admins can create tasks");
        }

        User editor = userRepository.findById(dto.getAssignedTo())
                .orElseThrow(() -> new RuntimeException("Editor not found with id: " + dto.getAssignedTo()));
        if (editor.getRole() != User.UserRole.EDITOR) {
            throw new RuntimeException("Task assignee must have EDITOR role");
        }

        Task task = new Task();
        task.setProjectId(projectId);
        task.setProject(project);
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setContentType(Task.ContentType.valueOf(dto.getContentType().trim().toUpperCase()));
        task.setAssignedTo(editor.getId());
        task.setAssignedEditor(editor);
        task.setDeadline(dto.getDeadline());
        task.setStatus(Task.TaskStatus.ASSIGNED);

        Task savedTask = taskRepository.save(task);

        if (project.getStatus() == ProjectRequest.ProjectStatus.PLAN_SENT || project.getStatus() == ProjectRequest.ProjectStatus.REQUESTED) {
            project.setStatus(ProjectRequest.ProjectStatus.IN_PROGRESS);
            projectRequestRepository.save(project);
        }

        notifyEditorTaskAssigned(savedTask);
        return mapTaskToResponseDTO(savedTask);
    }

    public List<TaskResponseDTO> getProjectTasks(String projectId) {
        projectRequestRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));

        return taskRepository.findByProjectId(projectId)
                .stream()
                .map(this::mapTaskToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<TaskResponseDTO> getEditorTasks(String editorId) {
        userRepository.findById(editorId)
                .orElseThrow(() -> new RuntimeException("Editor not found with id: " + editorId));

        return taskRepository.findByAssignedTo(editorId)
                .stream()
                .map(this::mapTaskToResponseDTO)
                .collect(Collectors.toList());
    }

    // ===== STAGE 5: EDITOR SUBMITS WORK =====
    @Transactional
    public TaskResponseDTO submitTask(String taskId, String editorId, SubmitTaskDTO dto) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));

        if (!task.getAssignedTo().equals(editorId)) {
            throw new RuntimeException("Unauthorized: task is not assigned to this editor");
        }

        int nextVersion = taskSubmissionRepository.findFirstByTaskIdOrderByVersionNumberDesc(taskId)
                .map(existing -> existing.getVersionNumber() + 1)
                .orElse(1);

        TaskSubmission submission = new TaskSubmission();
        submission.setTaskId(taskId);
        submission.setTask(task);
        submission.setSubmittedBy(editorId);
        submission.setSubmitter(task.getAssignedEditor());
        submission.setCdnUrl(dto.getCdnUrl());
        submission.setFileType(dto.getFileType());
        submission.setS3Key(dto.getS3Key());
        submission.setVersionNumber(nextVersion);

        taskSubmissionRepository.save(submission);

        task.setStatus(Task.TaskStatus.SUBMITTED);
        taskRepository.save(task);

        notifyAdminTaskSubmitted(task);
        return mapTaskToResponseDTO(task);
    }

    // ===== STAGE 6: ADMIN REVIEWS SUBMISSION =====
    @Transactional
    public TaskResponseDTO reviewTask(String taskId, String adminId, ReviewTaskSubmissionDTO dto) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found with id: " + adminId));
        if (admin.getRole() != User.UserRole.ADMIN) {
            throw new RuntimeException("Only admins can review submissions");
        }

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));

        TaskSubmission latestSubmission = taskSubmissionRepository.findFirstByTaskIdOrderByVersionNumberDesc(taskId)
                .orElseThrow(() -> new RuntimeException("No submission found for task: " + taskId));

        String action = dto.getAction().trim().toUpperCase();
        if ("APPROVE".equals(action)) {
            task.setStatus(Task.TaskStatus.APPROVED);
            latestSubmission.setAdminReviewNote(dto.getFeedback());
            taskSubmissionRepository.save(latestSubmission);
        } else if ("REQUEST_REVISION".equals(action) || "REVISION".equals(action)) {
            task.setStatus(Task.TaskStatus.NEEDS_REVISION);
            task.setAdminFeedback(dto.getFeedback());
            latestSubmission.setAdminReviewNote(dto.getFeedback());
            taskSubmissionRepository.save(latestSubmission);

            ProjectRequest project = task.getProject();
            if (project != null) {
                project.setStatus(ProjectRequest.ProjectStatus.REVISION);
                projectRequestRepository.save(project);
            }
        } else {
            throw new RuntimeException("Invalid review action. Use APPROVE or REQUEST_REVISION");
        }

        Task savedTask = taskRepository.save(task);
        markProjectDeliveredIfComplete(savedTask.getProjectId());
        notifyEditorTaskReviewed(savedTask);
        return mapTaskToResponseDTO(savedTask);
    }

    // ===== STAGE 7: STAKEHOLDER SIGNS OFF =====
    @Transactional
    public ProjectRequestResponseDTO signOffDelivery(String projectId, String clientId) {
        ProjectRequest project = projectRequestRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));

        if (!project.getClientId().equals(clientId)) {
            throw new RuntimeException("Unauthorized: You are not the client for this project");
        }

        if (project.getStatus() != ProjectRequest.ProjectStatus.DELIVERED) {
            throw new RuntimeException("Project must be in DELIVERED state before sign-off");
        }

        project.setStatus(ProjectRequest.ProjectStatus.SIGNED_OFF);
        ProjectRequest savedProject = projectRequestRepository.save(project);
        notifyAdminProjectSignedOff(savedProject);
        return mapToResponseDTO(savedProject);
    }

    private void markProjectDeliveredIfComplete(String projectId) {
        List<Task> tasks = taskRepository.findByProjectId(projectId);
        if (tasks.isEmpty()) {
            return;
        }

        boolean allApproved = tasks.stream().allMatch(task -> task.getStatus() == Task.TaskStatus.APPROVED);
        if (allApproved) {
            ProjectRequest project = projectRequestRepository.findById(projectId)
                    .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));
            project.setStatus(ProjectRequest.ProjectStatus.DELIVERED);
            projectRequestRepository.save(project);
            notifyStakeholderDeliveryReady(project);
        }
    }

    // ===== HELPER: MAP ENTITY TO DTO =====
    private ProjectRequestResponseDTO mapToResponseDTO(ProjectRequest project) {
        ProjectRequestResponseDTO dto = new ProjectRequestResponseDTO();
        dto.setId(project.getId());
        dto.setTitle(project.getTitle());
        dto.setDescription(project.getDescription());
        dto.setDeadline(project.getDeadline());
        dto.setStatus(project.getStatus().toString());
        dto.setCreatedAt(project.getCreatedAt());
        dto.setUpdatedAt(project.getUpdatedAt());

        // Parse content types from JSON
        try {
            List<String> contentTypes = objectMapper.readValue(
                    project.getContentTypes(),
                    new TypeReference<List<String>>() {}
            );
            dto.setContentTypes(contentTypes);
        } catch (Exception e) {
            log.warn("Failed to parse content types for project: {}", project.getId());
            dto.setContentTypes(List.of());
        }

        // Map client
        if (project.getClient() != null) {
            UserSummaryDTO clientDto = new UserSummaryDTO();
            clientDto.setId(project.getClient().getId());
            clientDto.setName(project.getClient().getName());
            clientDto.setEmail(project.getClient().getEmail());
            clientDto.setUsername(project.getClient().getUsername());
            clientDto.setRole(project.getClient().getRole().toString());
            dto.setClient(clientDto);
        }

        return dto;
    }

    private ProjectPlanResponseDTO mapPlanToResponseDTO(ProjectPlan plan) {
        ProjectPlanResponseDTO dto = new ProjectPlanResponseDTO();
        dto.setId(plan.getId());
        dto.setProjectId(plan.getProjectId());
        dto.setTimelineStart(plan.getTimelineStart());
        dto.setTimelineEnd(plan.getTimelineEnd());
        dto.setNotes(plan.getNotes());
        dto.setSentAt(plan.getSentAt());
        dto.setAcceptedAt(plan.getAcceptedAt());
        dto.setClientFeedback(plan.getClientFeedback());
        dto.setCreatedAt(plan.getCreatedAt());
        dto.setUpdatedAt(plan.getUpdatedAt());

        // Map admin
        if (plan.getAdmin() != null) {
            UserSummaryDTO adminDto = new UserSummaryDTO();
            adminDto.setId(plan.getAdmin().getId());
            adminDto.setName(plan.getAdmin().getName());
            adminDto.setEmail(plan.getAdmin().getEmail());
            adminDto.setUsername(plan.getAdmin().getUsername());
            adminDto.setRole(plan.getAdmin().getRole().toString());
            dto.setAdmin(adminDto);
        }

        // Map milestones
        if (plan.getMilestones() != null) {
            dto.setMilestones(plan.getMilestones().stream()
                    .map(m -> {
                        ProjectPlanResponseDTO.MilestoneSummaryDTO mDto = new ProjectPlanResponseDTO.MilestoneSummaryDTO();
                        mDto.setId(m.getId());
                        mDto.setTitle(m.getTitle());
                        mDto.setDueDate(m.getDueDate());
                        mDto.setOrderIndex(m.getOrderIndex());
                        return mDto;
                    })
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    private TaskResponseDTO mapTaskToResponseDTO(Task task) {
        TaskResponseDTO dto = new TaskResponseDTO();
        dto.setId(task.getId());
        dto.setProjectId(task.getProjectId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setContentType(task.getContentType().name());
        dto.setStatus(task.getStatus().name());
        dto.setDeadline(task.getDeadline());
        dto.setAdminFeedback(task.getAdminFeedback());
        dto.setCreatedAt(task.getCreatedAt());
        dto.setUpdatedAt(task.getUpdatedAt());

        if (task.getAssignedEditor() != null) {
            UserSummaryDTO editor = new UserSummaryDTO();
            editor.setId(task.getAssignedEditor().getId());
            editor.setName(task.getAssignedEditor().getName());
            editor.setEmail(task.getAssignedEditor().getEmail());
            editor.setUsername(task.getAssignedEditor().getUsername());
            editor.setRole(task.getAssignedEditor().getRole().name());
            dto.setAssignedEditor(editor);
        }

        taskSubmissionRepository.findFirstByTaskIdOrderByVersionNumberDesc(task.getId())
                .ifPresent(submission -> {
                    TaskResponseDTO.SubmissionSummaryDTO s = new TaskResponseDTO.SubmissionSummaryDTO();
                    s.setId(submission.getId());
                    s.setCdnUrl(submission.getCdnUrl());
                    s.setFileType(submission.getFileType());
                    s.setVersionNumber(submission.getVersionNumber());
                    s.setSubmittedAt(submission.getSubmittedAt());
                    s.setAdminReviewNote(submission.getAdminReviewNote());
                    dto.setLatestSubmission(s);
                });

        return dto;
    }

    // ===== NOTIFICATION HELPERS =====
    private void notifyAdminsNewRequest(ProjectRequest project) {
        List<User> admins = userRepository.findByRole(User.UserRole.ADMIN);
        for (User admin : admins) {
            Notification notification = new Notification();
            notification.setUserId(admin.getId());
            notification.setUser(admin);
            notification.setType("NEW_REQUEST");
            notification.setTitle("New Project Request");
            notification.setMessage("New project request: " + project.getTitle());
            notification.setRelatedEntityId(project.getId());
            notificationRepository.save(notification);
            log.info("Notified admin {} of new request: {}", admin.getId(), project.getId());
        }
    }

    private void notifyStakeholderPlanSent(ProjectRequest project, ProjectPlan plan) {
        Notification notification = new Notification();
        notification.setUserId(project.getClientId());
        notification.setUser(project.getClient());
        notification.setType("PLAN_SENT");
        notification.setTitle("Project Plan Ready");
        notification.setMessage("Your project plan for '" + project.getTitle() + "' is ready for review");
        notification.setRelatedEntityId(project.getId());
        notificationRepository.save(notification);
        log.info("Notified stakeholder {} of plan sent: {}", project.getClientId(), plan.getId());
    }

    private void notifyAdminPlanAccepted(ProjectRequest project) {
        ProjectPlan plan = projectPlanRepository.findByProjectId(project.getId()).orElse(null);
        if (plan != null) {
            Notification notification = new Notification();
            notification.setUserId(plan.getCreatedBy());
            notification.setUser(plan.getAdmin());
            notification.setType("PLAN_ACCEPTED");
            notification.setTitle("Plan Accepted");
            notification.setMessage("Client accepted your plan for project: " + project.getTitle());
            notification.setRelatedEntityId(project.getId());
            notificationRepository.save(notification);
            log.info("Notified admin {} that plan was accepted: {}", plan.getCreatedBy(), project.getId());
        }
    }

    private void notifyAdminRequestChanges(ProjectRequest project) {
        ProjectPlan plan = projectPlanRepository.findByProjectId(project.getId()).orElse(null);
        if (plan != null) {
            Notification notification = new Notification();
            notification.setUserId(plan.getCreatedBy());
            notification.setUser(plan.getAdmin());
            notification.setType("PLAN_CHANGE_REQUESTED");
            notification.setTitle("Plan Changes Requested");
            notification.setMessage("Client has requested changes to the plan for: " + project.getTitle());
            notification.setRelatedEntityId(project.getId());
            notificationRepository.save(notification);
            log.info("Notified admin {} of change request: {}", plan.getCreatedBy(), project.getId());
        }
    }

    private void notifyEditorTaskAssigned(Task task) {
        Notification notification = new Notification();
        notification.setUserId(task.getAssignedTo());
        notification.setUser(task.getAssignedEditor());
        notification.setType("TASK_ASSIGNED");
        notification.setTitle("New Task Assigned");
        notification.setMessage("You have been assigned task: " + task.getTitle());
        notification.setRelatedEntityId(task.getId());
        notificationRepository.save(notification);
    }

    private void notifyAdminTaskSubmitted(Task task) {
        List<User> admins = userRepository.findByRole(User.UserRole.ADMIN);
        for (User admin : admins) {
            Notification notification = new Notification();
            notification.setUserId(admin.getId());
            notification.setUser(admin);
            notification.setType("TASK_SUBMITTED");
            notification.setTitle("Task Submitted");
            notification.setMessage("Editor submitted work for task: " + task.getTitle());
            notification.setRelatedEntityId(task.getId());
            notificationRepository.save(notification);
        }
    }

    private void notifyEditorTaskReviewed(Task task) {
        Notification notification = new Notification();
        notification.setUserId(task.getAssignedTo());
        notification.setUser(task.getAssignedEditor());
        notification.setType("TASK_REVIEWED");
        notification.setTitle("Task Review Update");
        notification.setMessage("Admin reviewed task: " + task.getTitle() + " (" + task.getStatus().name() + ")");
        notification.setRelatedEntityId(task.getId());
        notificationRepository.save(notification);
    }

    private void notifyStakeholderDeliveryReady(ProjectRequest project) {
        Notification notification = new Notification();
        notification.setUserId(project.getClientId());
        notification.setUser(project.getClient());
        notification.setType("DELIVERY_READY");
        notification.setTitle("Project Delivery Ready");
        notification.setMessage("All tasks are approved for project: " + project.getTitle());
        notification.setRelatedEntityId(project.getId());
        notificationRepository.save(notification);
    }

    private void notifyAdminProjectSignedOff(ProjectRequest project) {
        List<User> admins = userRepository.findByRole(User.UserRole.ADMIN);
        for (User admin : admins) {
            Notification notification = new Notification();
            notification.setUserId(admin.getId());
            notification.setUser(admin);
            notification.setType("PROJECT_SIGNED_OFF");
            notification.setTitle("Stakeholder Sign-off Completed");
            notification.setMessage("Stakeholder signed off project: " + project.getTitle());
            notification.setRelatedEntityId(project.getId());
            notificationRepository.save(notification);
        }
    }
}
