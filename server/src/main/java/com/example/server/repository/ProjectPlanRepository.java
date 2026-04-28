package com.example.server.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.server.entity.ProjectPlan;

@Repository
public interface ProjectPlanRepository extends JpaRepository<ProjectPlan, String> {
    Optional<ProjectPlan> findByProjectId(String projectId);
    List<ProjectPlan> findAllByProjectIdOrderByCreatedAtDesc(String projectId);
}
