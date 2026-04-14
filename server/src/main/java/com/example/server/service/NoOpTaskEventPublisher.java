package com.example.server.service;

import com.example.server.entity.Task;
import com.example.server.entity.TaskSubmission;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnProperty(name = "app.kafka.enabled", havingValue = "false", matchIfMissing = true)
public class NoOpTaskEventPublisher implements TaskEventPublisher {

    private static final Logger log = LoggerFactory.getLogger(NoOpTaskEventPublisher.class);

    @Override
    public void publishTaskSubmitted(Task task, TaskSubmission submission) {
        log.debug("Kafka disabled: skipping TaskSubmitted event for task {}", task.getId());
    }

    @Override
    public void publishTaskApproved(Task task, TaskSubmission submission) {
        log.debug("Kafka disabled: skipping TaskApproved event for task {}", task.getId());
    }
}
