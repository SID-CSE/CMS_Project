package com.example.server.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.server.entity.PasswordResetToken;
import com.example.server.entity.User;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, String> {

    Optional<PasswordResetToken> findByTokenAndUsedAtIsNull(String token);

    void deleteByUser(User user);

    long deleteByExpiresAtBefore(LocalDateTime cutoff);
}
