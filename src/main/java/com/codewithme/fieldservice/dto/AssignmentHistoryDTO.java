
package com.codewithme.fieldservice.dto;

import java.time.LocalDateTime;

public class AssignmentHistoryDTO {

    private Long id;
    private Long workOrderId;
    private String workOrderCode;
    private Long technicianId;
    private String technicianUsername;
    private LocalDateTime assignedAt;

    public AssignmentHistoryDTO(
            Long id,
            Long workOrderId,
            String workOrderCode,
            Long technicianId,
            String technicianUsername,
            LocalDateTime assignedAt) {

        this.id = id;
        this.workOrderId = workOrderId;
        this.workOrderCode = workOrderCode;
        this.technicianId = technicianId;
        this.technicianUsername = technicianUsername;
        this.assignedAt = assignedAt;
    }

    public Long getId() {
        return id;
    }

    public Long getWorkOrderId() {
        return workOrderId;
    }

    public String getWorkOrderCode() {
        return workOrderCode;
    }

    public Long getTechnicianId() {
        return technicianId;
    }

    public String getTechnicianUsername() {
        return technicianUsername;
    }

    public LocalDateTime getAssignedAt() {
        return assignedAt;
    }
}
