package com.example.server.repository;

import com.example.server.entity.TaskSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaskSubmissionRepository extends JpaRepository<TaskSubmission, String> {
    List<TaskSubmission> findByTaskId(String taskId);
    Optional<TaskSubmission> findFirstByTaskIdOrderByVersionNumberDesc(String taskId);
}
