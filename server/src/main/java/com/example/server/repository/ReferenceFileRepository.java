package com.example.server.repository;

import com.example.server.entity.ReferenceFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReferenceFileRepository extends JpaRepository<ReferenceFile, String> {
    List<ReferenceFile> findByProjectId(String projectId);
}
