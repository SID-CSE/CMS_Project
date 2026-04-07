package com.example.server.repository;

import com.example.server.entity.ProjectRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProjectRequestRepository extends JpaRepository<ProjectRequest, String> {
    List<ProjectRequest> findByClientId(String clientId);
    List<ProjectRequest> findByStatus(ProjectRequest.ProjectStatus status);
}
