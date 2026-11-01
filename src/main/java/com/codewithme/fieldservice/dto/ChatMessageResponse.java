
package com.codewithme.fieldservice.dto;

import java.time.LocalDateTime;

public record ChatMessageResponse(
        Long id,
        Long conversationId,
        String message,
        String senderUsername,
        LocalDateTime sentAt
) {
}
