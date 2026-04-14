package com.example.server.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.server.entity.Message;

@Repository
public interface MessageRepository extends JpaRepository<Message, String> {
    List<Message> findBySenderIdOrRecipientIdOrderByCreatedAtDesc(String senderId, String recipientId);

    List<Message> findBySenderIdAndRecipientIdOrSenderIdAndRecipientIdOrderByCreatedAtAsc(
            String senderIdOne,
            String recipientIdOne,
            String senderIdTwo,
            String recipientIdTwo);

    List<Message> findBySenderIdAndRecipientIdAndProjectIdOrSenderIdAndRecipientIdAndProjectIdOrderByCreatedAtAsc(
            String senderIdOne,
            String recipientIdOne,
            String projectIdOne,
            String senderIdTwo,
            String recipientIdTwo,
            String projectIdTwo);
}