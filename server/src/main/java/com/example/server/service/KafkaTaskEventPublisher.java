package com.example.server.service;

import com.example.server.entity.Task;
import com.example.server.entity.TaskSubmission;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
@ConditionalOnProperty(name = "app.kafka.enabled", havingValue = "true")
public class KafkaTaskEventPublisher implements TaskEventPublisher {

    private static final Logger log = LoggerFactory.getLogger(KafkaTaskEventPublisher.class);

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;
    private final String taskTopic;

    public KafkaTaskEventPublisher(
            KafkaTemplate<String, String> kafkaTemplate,
            ObjectMapper objectMapper,
            @Value("${app.kafka.task-topic:contify.task-events}") String taskTopic) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
        this.taskTopic = taskTopic;
    }

    @Override
    public void publishTaskSubmitted(Task task, TaskSubmission submission) {
        publish("TaskSubmitted", task, submission);
    }

    @Override
    public void publishTaskApproved(Task task, TaskSubmission submission) {
        publish("TaskApproved", task, submission);
    }

    private void publish(String eventType, Task task, TaskSubmission submission) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("eventType", eventType);
        payload.put("taskId", task.getId());
        payload.put("projectId", task.getProjectId());
        payload.put("taskStatus", task.getStatus() == null ? null : task.getStatus().name());
        payload.put("submissionId", submission.getId());
        payload.put("publicId", submission.getS3Key());
        payload.put("fileType", submission.getFileType());
        payload.put("versionNumber", submission.getVersionNumber());
        payload.put("stakeholderVisible", task.getStatus() == Task.TaskStatus.APPROVED);
        payload.put("timestamp", Instant.now().toString());

        try {
            kafkaTemplate.send(taskTopic, task.getId(), objectMapper.writeValueAsString(payload));
        } catch (Exception ex) {
            log.warn("Kafka publish skipped for {} because of: {}", eventType, ex.getMessage());
        }
    }
}