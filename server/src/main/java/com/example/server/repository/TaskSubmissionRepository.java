package com.example.server.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.server.entity.TaskSubmission;

@Repository
public interface TaskSubmissionRepository extends JpaRepository<TaskSubmission, String> {
    List<TaskSubmission> findByTaskId(String taskId);
    Optional<TaskSubmission> findFirstByTaskIdOrderByVersionNumberDesc(String taskId);
    Optional<TaskSubmission> findFirstByTaskIdAndStakeholderVisibleTrueOrderByVersionNumberDesc(String taskId);
}
