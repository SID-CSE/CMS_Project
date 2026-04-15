package com.example.server.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.server.entity.ClientCompanyProfile;

@Repository
public interface ClientCompanyProfileRepository extends JpaRepository<ClientCompanyProfile, Long> {
    Optional<ClientCompanyProfile> findByUserId(String userId);
}
