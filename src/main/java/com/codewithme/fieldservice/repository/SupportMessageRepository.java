package com.codewithme.fieldservice.repository;

import com.codewithme.fieldservice.model.SupportMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SupportMessageRepository
        extends JpaRepository<SupportMessage, Long> {

    List<SupportMessage> findBySupportTicketIdOrderByCreatedAtAsc(Long ticketId);
}