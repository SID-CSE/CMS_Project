package com.example.server.service;

import com.example.server.entity.Task;
import com.example.server.entity.TaskSubmission;

public interface TaskEventPublisher {
    void publishTaskSubmitted(Task task, TaskSubmission submission);
    void publishTaskApproved(Task task, TaskSubmission submission);
}