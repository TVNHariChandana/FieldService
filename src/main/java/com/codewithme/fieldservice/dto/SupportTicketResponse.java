package com.codewithme.fieldservice.dto;

import com.codewithme.fieldservice.model.SupportTicketStatus;

import java.time.LocalDateTime;

public record SupportTicketResponse(
        Long id,
        String subject,
        String description,
        Long customerId,
        String customerName,
        SupportTicketStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}