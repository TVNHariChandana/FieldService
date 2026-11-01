package com.codewithme.fieldservice.dto;

import com.codewithme.fieldservice.model.Role;

import java.time.LocalDateTime;

public record SupportMessageResponse(
        Long id,
        Long ticketId,
        Long senderId,
        String senderUsername,
        Role senderRole,
        String message,
        LocalDateTime createdAt
) {}