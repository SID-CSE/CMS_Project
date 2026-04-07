package com.example.server.repository;

import com.example.server.entity.ProjectPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ProjectPlanRepository extends JpaRepository<ProjectPlan, String> {
    Optional<ProjectPlan> findByProjectId(String projectId);
}
