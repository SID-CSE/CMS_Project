package com.example.server.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.server.dto.CreateFinanceRequestDTO;
import com.example.server.dto.FinanceDistributionDTO;
import com.example.server.dto.FinanceProjectDTO;
import com.example.server.dto.FinanceRequestDTO;
import com.example.server.entity.FinanceDistribution;
import com.example.server.entity.FinanceRequest;
import com.example.server.entity.ProjectRequest;
import com.example.server.entity.Task;
import com.example.server.entity.User;
import com.example.server.repository.FinanceDistributionRepository;
import com.example.server.repository.FinanceRequestRepository;
import com.example.server.repository.ProjectRequestRepository;
import com.example.server.repository.TaskRepository;
import com.example.server.repository.UserRepository;

@Service
public class FinanceService {

    private final FinanceRequestRepository financeRequestRepository;
    private final FinanceDistributionRepository financeDistributionRepository;
    private final ProjectRequestRepository projectRequestRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public FinanceService(
            FinanceRequestRepository financeRequestRepository,
            FinanceDistributionRepository financeDistributionRepository,
            ProjectRequestRepository projectRequestRepository,
            TaskRepository taskRepository,
            UserRepository userRepository,
            NotificationService notificationService) {
        this.financeRequestRepository = financeRequestRepository;
        this.financeDistributionRepository = financeDistributionRepository;
        this.projectRequestRepository = projectRequestRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public FinanceRequestDTO createRequest(String projectId, String adminEmail, CreateFinanceRequestDTO dto) {
        User admin = resolveUser(adminEmail, User.UserRole.ADMIN, "Admin");
        ProjectRequest project = projectRequestRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));
        User stakeholder = userRepository.findById(project.getClientId())
                .orElseThrow(() -> new RuntimeException("Stakeholder not found with id: " + project.getClientId()));

        if (dto.getTotalAmount() == null || dto.getTotalAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Total amount must be greater than zero");
        }
        if (dto.getCompanyProfitAmount() == null || dto.getCompanyProfitAmount().compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("Company profit amount is required");
        }
        if (dto.getCompanyProfitAmount().compareTo(dto.getTotalAmount()) > 0) {
            throw new RuntimeException("Company profit cannot exceed total amount");
        }

        FinanceRequest request = new FinanceRequest();
        request.setProjectId(projectId);
        request.setProject(project);
        request.setRequestedBy(admin.getId());
        request.setAdmin(admin);
        request.setStakeholderId(stakeholder.getId());
        request.setStakeholder(stakeholder);
        request.setTotalAmount(dto.getTotalAmount().setScale(2, RoundingMode.HALF_UP));
        request.setCompanyProfitAmount(dto.getCompanyProfitAmount().setScale(2, RoundingMode.HALF_UP));
        request.setNote(dto.getNote());
        request.setStatus(FinanceRequest.FinanceStatus.SENT);

        FinanceRequest saved = financeRequestRepository.save(request);

        notificationService.createNotification(
            stakeholder.getId(),
            stakeholder,
            "FINANCE_REQUEST_SENT",
            "Payment Request Sent",
            "A payment request was sent for project: " + project.getTitle(),
            saved.getId());

        return mapRequest(saved);
    }

    @Transactional(readOnly = true)
    public List<FinanceRequestDTO> getAdminRequests(String adminEmail) {
        User admin = resolveUser(adminEmail, User.UserRole.ADMIN, "Admin");
        return financeRequestRepository.findByRequestedByOrderByCreatedAtDesc(admin.getId()).stream().map(this::mapRequest).toList();
    }

    @Transactional(readOnly = true)
    public List<FinanceRequestDTO> getStakeholderRequests(String stakeholderEmail) {
        User stakeholder = resolveUser(stakeholderEmail, User.UserRole.STAKEHOLDER, "Stakeholder");
        return financeRequestRepository.findByStakeholderIdOrderByCreatedAtDesc(stakeholder.getId()).stream().map(this::mapRequest).toList();
    }

    @Transactional(readOnly = true)
    public List<FinanceDistributionDTO> getEditorPayouts(String editorEmail) {
        User editor = resolveUser(editorEmail, User.UserRole.EDITOR, "Editor");
        return financeDistributionRepository.findByRecipientUserIdOrderByCreatedAtDesc(editor.getId()).stream().map(this::mapDistribution).toList();
    }

    @Transactional
    public FinanceRequestDTO markRequestPaid(String requestId, String stakeholderEmail) {
        User stakeholder = resolveUser(stakeholderEmail, User.UserRole.STAKEHOLDER, "Stakeholder");
        FinanceRequest request = financeRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Finance request not found with id: " + requestId));

        if (!request.getStakeholderId().equals(stakeholder.getId())) {
            throw new RuntimeException("Unauthorized: this request does not belong to the current stakeholder");
        }
        if (request.getStatus() != FinanceRequest.FinanceStatus.SENT) {
            throw new RuntimeException("Finance request must be SENT before payment is recorded");
        }

        request.setStatus(FinanceRequest.FinanceStatus.PAID);
        request.setPaidAt(LocalDateTime.now());
        FinanceRequest saved = financeRequestRepository.save(request);

        User admin = userRepository.findById(saved.getRequestedBy()).orElse(null);
        if (admin != null) {
            notificationService.createNotification(
                    admin.getId(),
                    admin,
                    "FINANCE_REQUEST_PAID",
                    "Payment Confirmed",
                    "Stakeholder marked finance request as paid for project: " + (saved.getProject() != null ? saved.getProject().getTitle() : saved.getProjectId()),
                    saved.getId());
        }

        return mapRequest(saved);
    }

    @Transactional
    public FinanceRequestDTO distributeRequest(String requestId, String adminEmail) {
        User admin = resolveUser(adminEmail, User.UserRole.ADMIN, "Admin");
        FinanceRequest request = financeRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Finance request not found with id: " + requestId));

        if (!request.getRequestedBy().equals(admin.getId())) {
            throw new RuntimeException("Unauthorized: this request was not created by the current admin");
        }
        if (request.getStatus() != FinanceRequest.FinanceStatus.PAID) {
            throw new RuntimeException("Finance request must be PAID before distribution");
        }

        List<Task> projectTasks = taskRepository.findByProjectId(request.getProjectId());
        Map<String, User> contributors = new LinkedHashMap<>();
        for (Task task : projectTasks) {
            if (task.getAssignedEditor() != null) {
                contributors.put(task.getAssignedEditor().getId(), task.getAssignedEditor());
            }
        }

        if (contributors.isEmpty()) {
            throw new RuntimeException("No contributors found for this project");
        }

        BigDecimal total = request.getTotalAmount().setScale(2, RoundingMode.HALF_UP);
        BigDecimal companyProfit = request.getCompanyProfitAmount().setScale(2, RoundingMode.HALF_UP);
        BigDecimal workerPool = total.subtract(companyProfit).setScale(2, RoundingMode.HALF_UP);
        if (workerPool.compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("Company profit cannot exceed the total amount");
        }

        BigDecimal equalShare = workerPool.divide(BigDecimal.valueOf(contributors.size()), 2, RoundingMode.DOWN);
        BigDecimal allocatedToWorkers = equalShare.multiply(BigDecimal.valueOf(contributors.size())).setScale(2, RoundingMode.HALF_UP);
        BigDecimal remainder = workerPool.subtract(allocatedToWorkers).setScale(2, RoundingMode.HALF_UP);

        List<FinanceDistribution> distributions = new ArrayList<>();
        for (User contributor : contributors.values()) {
            FinanceDistribution distribution = new FinanceDistribution();
            distribution.setRequestId(request.getId());
            distribution.setRequest(request);
            distribution.setRecipientUserId(contributor.getId());
            distribution.setRecipientUser(contributor);
            distribution.setRecipientType("WORKER");
            distribution.setRecipientName(contributor.getName() != null ? contributor.getName() : contributor.getUsername());
            distribution.setAmount(equalShare);
            distribution.setStatus("PAID");
            distributions.add(distribution);
        }

        FinanceDistribution companyDistribution = new FinanceDistribution();
        companyDistribution.setRequestId(request.getId());
        companyDistribution.setRequest(request);
        companyDistribution.setRecipientType("COMPANY");
        companyDistribution.setRecipientName("Contify Company Profit");
        companyDistribution.setAmount(companyProfit.add(remainder).setScale(2, RoundingMode.HALF_UP));
        companyDistribution.setStatus("PAID");
        distributions.add(companyDistribution);

        financeDistributionRepository.saveAll(distributions);
        request.setStatus(FinanceRequest.FinanceStatus.DISTRIBUTED);
        request.setDistributedAt(LocalDateTime.now());
        financeRequestRepository.save(request);

        String projectTitle = request.getProject() != null ? request.getProject().getTitle() : request.getProjectId();
        for (User contributor : contributors.values()) {
            notificationService.createNotification(
                    contributor.getId(),
                    contributor,
                    "FINANCE_DISTRIBUTED",
                    "Payout Released",
                    "Your payout has been released for project: " + projectTitle,
                    request.getId());
        }

        User stakeholder = userRepository.findById(request.getStakeholderId()).orElse(null);
        if (stakeholder != null) {
            notificationService.createNotification(
                    stakeholder.getId(),
                    stakeholder,
                    "FINANCE_DISTRIBUTED",
                    "Distribution Completed",
                    "Payment distribution completed for project: " + projectTitle,
                    request.getId());
        }

        return mapRequest(request);
    }

    @Transactional(readOnly = true)
    public List<FinanceRequestDTO> getProjectRequests(String projectId) {
        return financeRequestRepository.findByProjectIdOrderByCreatedAtDesc(projectId).stream().map(this::mapRequest).toList();
    }

    @Transactional(readOnly = true)
    public List<FinanceProjectDTO> getAdminProjects() {
        return projectRequestRepository.findAll().stream().map(project -> {
            List<Task> tasks = taskRepository.findByProjectId(project.getId());
            long submittedCount = tasks.stream().filter(task -> task.getStatus() == Task.TaskStatus.SUBMITTED || task.getStatus() == Task.TaskStatus.APPROVED).count();
            FinanceProjectDTO dto = new FinanceProjectDTO();
            dto.setProjectId(project.getId());
            dto.setProjectTitle(project.getTitle());
            dto.setStakeholderId(project.getClientId());
            dto.setStakeholderName(project.getClient() != null ? project.getClient().getName() : project.getClientId());
            dto.setProjectStatus(project.getStatus().name());
            dto.setTaskCount(tasks.size());
            dto.setSubmittedTaskCount(submittedCount);
            dto.setLatestFinanceStatus(financeRequestRepository.findByProjectIdOrderByCreatedAtDesc(project.getId()).stream().findFirst().map(request -> request.getStatus().name()).orElse("NONE"));
            return dto;
        }).toList();
    }

    private User resolveUser(String email, User.UserRole role, String label) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException(label + " not found with email: " + email));
        if (user.getRole() != role) {
            throw new RuntimeException("Only " + label.toLowerCase() + "s can perform this action");
        }
        return user;
    }

    private FinanceRequestDTO mapRequest(FinanceRequest request) {
        FinanceRequestDTO dto = new FinanceRequestDTO();
        dto.setId(request.getId());
        dto.setProjectId(request.getProjectId());
        dto.setProjectTitle(request.getProject() != null ? request.getProject().getTitle() : request.getProjectId());
        dto.setStakeholderId(request.getStakeholderId());
        dto.setStakeholderName(request.getStakeholder() != null ? request.getStakeholder().getName() : request.getStakeholderId());
        dto.setTotalAmount(request.getTotalAmount());
        dto.setCompanyProfitAmount(request.getCompanyProfitAmount());
        dto.setWorkerPoolAmount(request.getTotalAmount().subtract(request.getCompanyProfitAmount()));
        dto.setNote(request.getNote());
        dto.setStatus(request.getStatus().name());
        dto.setPaidAt(request.getPaidAt());
        dto.setDistributedAt(request.getDistributedAt());
        dto.setCreatedAt(request.getCreatedAt());
        dto.setDistributions(financeDistributionRepository.findByRequestIdOrderByCreatedAtAsc(request.getId()).stream().map(this::mapDistribution).toList());
        return dto;
    }

    private FinanceDistributionDTO mapDistribution(FinanceDistribution distribution) {
        FinanceDistributionDTO dto = new FinanceDistributionDTO();
        dto.setId(distribution.getId());
        dto.setRecipientUserId(distribution.getRecipientUserId());
        dto.setRecipientType(distribution.getRecipientType());
        dto.setRecipientName(distribution.getRecipientName());
        dto.setAmount(distribution.getAmount());
        dto.setStatus(distribution.getStatus());
        dto.setCreatedAt(distribution.getCreatedAt());
        dto.setPaidAt(distribution.getPaidAt());
        return dto;
    }
}