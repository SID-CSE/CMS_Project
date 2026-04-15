package com.example.server.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.server.entity.EditorProfile;

@Repository
public interface EditorProfileRepository extends JpaRepository<EditorProfile, Long> {
    Optional<EditorProfile> findByUserId(String userId);
}
