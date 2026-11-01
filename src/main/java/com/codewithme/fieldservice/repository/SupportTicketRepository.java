package com.codewithme.fieldservice.repository;

import com.codewithme.fieldservice.model.SupportTicket;
import com.codewithme.fieldservice.model.SupportTicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SupportTicketRepository
        extends JpaRepository<SupportTicket, Long> {

    // Get tickets belonging to a particular customer
    List<SupportTicket> findByCustomerId(Long customerId);

    // Get all tickets, newest first
    List<SupportTicket> findAllByOrderByCreatedAtDesc();

    // Get a customer's tickets, newest first
    List<SupportTicket> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

    // Filter tickets by status
    List<SupportTicket> findByStatus(SupportTicketStatus status);
}