
package com.codewithme.fieldservice.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateConversationRequest {

    @NotNull(message = "Work order ID is required")
    @Positive(message = "Work order ID must be positive")
    private Long workOrderId;

    @NotBlank(message = "Subject is required")
    private String subject;
}
