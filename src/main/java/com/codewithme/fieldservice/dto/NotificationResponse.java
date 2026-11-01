package com.codewithme.fieldservice.dto;

import java.time.LocalDateTime;

public record NotificationResponse(
        Long id,
        String title,
        String message,
        String type,
        Long relatedEntityId,
        boolean isRead,
        LocalDateTime createdAt
) {}