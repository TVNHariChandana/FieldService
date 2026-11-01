package com.codewithme.fieldservice.dto;

import java.time.LocalDateTime;

public record ChatConversationResponse(
        Long id,
        String subject,
        Long workOrderId,
        LocalDateTime createdAt
) {
}