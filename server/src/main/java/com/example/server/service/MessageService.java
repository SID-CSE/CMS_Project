package com.example.server.service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.server.dto.MessageDTO;
import com.example.server.dto.MessageThreadDTO;
import com.example.server.dto.SendMessageDTO;
import com.example.server.dto.UserSummaryDTO;
import com.example.server.entity.Message;
import com.example.server.entity.ProjectRequest;
import com.example.server.entity.Task;
import com.example.server.entity.User;
import com.example.server.repository.MessageRepository;
import com.example.server.repository.ProjectRequestRepository;
import com.example.server.repository.TaskRepository;
import com.example.server.repository.UserRepository;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ProjectRequestRepository projectRequestRepository;
    private final TaskRepository taskRepository;
    private final NotificationService notificationService;

    public MessageService(
            MessageRepository messageRepository,
            UserRepository userRepository,
            ProjectRequestRepository projectRequestRepository,
            TaskRepository taskRepository,
            NotificationService notificationService) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.projectRequestRepository = projectRequestRepository;
        this.taskRepository = taskRepository;
        this.notificationService = notificationService;
    }

    @Transactional(readOnly = true)
    public List<MessageThreadDTO> getInbox(String currentUserId) {
        List<Message> messages = messageRepository.findBySenderIdOrRecipientIdOrderByCreatedAtDesc(currentUserId, currentUserId);
        Map<String, List<Message>> grouped = messages.stream()
                .collect(Collectors.groupingBy(message -> threadKey(currentUserId, message), LinkedHashMap::new, Collectors.toList()));

        return grouped.values().stream()
                .map(group -> buildThread(currentUserId, group))
                .sorted(Comparator.comparing(MessageThreadDTO::getLastMessageAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MessageDTO> getThread(String currentUserId, String counterpartId, String projectId) {
        validateParticipant(currentUserId, counterpartId);
        return getThreadEntities(currentUserId, counterpartId, projectId).stream()
                .map(message -> mapMessage(message, resolveProjectTitle(message.getProjectId())))
                .toList();
    }

    @Transactional
    public MessageDTO send(String currentUserId, SendMessageDTO dto) {
        if (dto.getRecipientId() == null || dto.getRecipientId().isBlank()) {
            throw new RuntimeException("Recipient is required");
        }
        if (dto.getBody() == null || dto.getBody().isBlank()) {
            throw new RuntimeException("Message body is required");
        }

        validateParticipant(currentUserId, dto.getRecipientId());
        String projectId = resolveProjectId(dto.getProjectId(), dto.getTaskId());

        Message message = new Message();
        message.setSenderId(currentUserId);
        message.setRecipientId(dto.getRecipientId());
        message.setProjectId(projectId);
        message.setTaskId(dto.getTaskId());
        message.setBody(dto.getBody().trim());
        message.setIsRead(false);

        Message saved = messageRepository.save(message);

        User sender = resolveUser(currentUserId);
        User recipient = resolveUser(dto.getRecipientId());
        String relatedEntityId = projectId != null && !projectId.isBlank() ? projectId : saved.getId();
        notificationService.createNotification(
            recipient.getId(),
            recipient,
            "NEW_MESSAGE",
            "New Message",
            (sender.getName() == null || sender.getName().isBlank() ? sender.getEmail() : sender.getName()) + " sent you a message",
            relatedEntityId);

        return mapMessage(saved, resolveProjectTitle(projectId));
    }

    @Transactional
    public void markThreadRead(String currentUserId, String counterpartId, String projectId) {
        validateParticipant(currentUserId, counterpartId);
        List<Message> thread = getThreadEntities(currentUserId, counterpartId, projectId);
        thread.stream()
                .filter(message -> Objects.equals(message.getRecipientId(), currentUserId) && !Boolean.TRUE.equals(message.getIsRead()))
                .forEach(message -> {
                    message.setIsRead(true);
                    message.setReadAt(LocalDateTime.now());
                });
        messageRepository.saveAll(thread);
    }

    @Transactional(readOnly = true)
    public List<UserSummaryDTO> getContacts(String currentUserId, String roleFilter) {
        return userRepository.findAll().stream()
                .filter(user -> !Objects.equals(user.getId(), currentUserId))
                .filter(user -> user.getIsActive() == null || Boolean.TRUE.equals(user.getIsActive()))
                .filter(user -> roleFilter == null || roleFilter.isBlank() || matchesRole(user, roleFilter))
                .map(this::mapUser)
                .sorted(Comparator.comparing(UserSummaryDTO::getName, Comparator.nullsLast(Comparator.naturalOrder())))
                .toList();
    }

    private List<Message> getThreadEntities(String currentUserId, String counterpartId, String projectId) {
        if (projectId != null && !projectId.isBlank()) {
            return messageRepository.findBySenderIdAndRecipientIdAndProjectIdOrSenderIdAndRecipientIdAndProjectIdOrderByCreatedAtAsc(
                    currentUserId,
                    counterpartId,
                    projectId,
                    counterpartId,
                    currentUserId,
                    projectId);
        }
        return messageRepository.findBySenderIdAndRecipientIdOrSenderIdAndRecipientIdOrderByCreatedAtAsc(
                currentUserId,
                counterpartId,
                counterpartId,
                currentUserId);
    }

    private MessageThreadDTO buildThread(String currentUserId, List<Message> group) {
        Message lastMessage = group.stream()
                .max(Comparator.comparing(Message::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder())))
                .orElse(group.get(0));

        String counterpartId = Objects.equals(lastMessage.getSenderId(), currentUserId)
                ? lastMessage.getRecipientId()
                : lastMessage.getSenderId();

        MessageThreadDTO dto = new MessageThreadDTO();
        dto.setCounterpartId(counterpartId);
        dto.setCounterpart(mapUser(resolveUser(counterpartId)));
        dto.setProjectId(lastMessage.getProjectId());
        dto.setProjectTitle(resolveProjectTitle(lastMessage.getProjectId()));
        dto.setLastMessage(lastMessage.getBody());
        dto.setLastMessageAt(lastMessage.getCreatedAt());
        dto.setUnreadCount(group.stream().filter(message -> Objects.equals(message.getRecipientId(), currentUserId) && !Boolean.TRUE.equals(message.getIsRead())).count());
        return dto;
    }

    private MessageDTO mapMessage(Message message, String projectTitle) {
        MessageDTO dto = new MessageDTO();
        dto.setId(message.getId());
        dto.setSenderId(message.getSenderId());
        dto.setRecipientId(message.getRecipientId());
        dto.setProjectId(message.getProjectId());
        dto.setProjectTitle(projectTitle);
        dto.setTaskId(message.getTaskId());
        dto.setBody(message.getBody());
        dto.setRead(Boolean.TRUE.equals(message.getIsRead()));
        dto.setReadAt(message.getReadAt());
        dto.setCreatedAt(message.getCreatedAt());
        return dto;
    }

    private String resolveProjectId(String projectId, String taskId) {
        if (projectId != null && !projectId.isBlank()) {
            return projectId.trim();
        }
        if (taskId != null && !taskId.isBlank()) {
            Task task = taskRepository.findById(taskId.trim())
                    .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));
            return task.getProjectId();
        }
        return null;
    }

    private String resolveProjectTitle(String projectId) {
        if (projectId == null || projectId.isBlank()) {
            return null;
        }
        return projectRequestRepository.findById(projectId)
                .map(ProjectRequest::getTitle)
                .orElse(projectId);
    }

    private User resolveUser(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    }

    private UserSummaryDTO mapUser(User user) {
        UserSummaryDTO summary = new UserSummaryDTO();
        summary.setId(user.getId());
        summary.setName(user.getName());
        summary.setEmail(user.getEmail());
        summary.setUsername(user.getUsername());
        summary.setRole(user.getRole() == null ? null : user.getRole().name());
        return summary;
    }

    private boolean matchesRole(User user, String roleFilter) {
        String normalized = roleFilter.trim().toUpperCase();
        for (String role : normalized.split(",")) {
            if (user.getRole() != null && user.getRole().name().equals(role.trim())) {
                return true;
            }
        }
        return false;
    }

    private void validateParticipant(String currentUserId, String counterpartId) {
        if (Objects.equals(currentUserId, counterpartId)) {
            throw new RuntimeException("Cannot message yourself");
        }
        resolveUser(currentUserId);
        resolveUser(counterpartId);
    }

    private String threadKey(String currentUserId, Message message) {
        String counterpartId = Objects.equals(currentUserId, message.getSenderId()) ? message.getRecipientId() : message.getSenderId();
        return counterpartId + "|" + (message.getProjectId() == null ? "" : message.getProjectId());
    }
}