

package com.codewithme.fieldservice.dto;

import com.codewithme.fieldservice.model.WorkOrderStatus;

import java.time.LocalDateTime;

public class WorkOrderDTO {

    private Long id;
    private String code;
    private String title;
    private String description;
    private String priority;
    private WorkOrderStatus status;
    private LocalDateTime slaDueAt;
    private Long technicianId;
    private String technicianUsername;
    private Long customerId;
    private Long siteId;

    public WorkOrderDTO(
            Long id,
            String code,
            String title,
            String description,
            String priority,
            WorkOrderStatus status,
            LocalDateTime slaDueAt,
            Long technicianId,
            String technicianUsername,
            Long customerId,
            Long siteId) {

        this.id = id;
        this.code = code;
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.status = status;
        this.slaDueAt = slaDueAt;
        this.technicianId = technicianId;
        this.technicianUsername = technicianUsername;
        this.customerId = customerId;
        this.siteId = siteId;
    }

    public Long getId() { return id; }
    public String getCode() { return code; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getPriority() { return priority; }
    public WorkOrderStatus getStatus() { return status; }
    public LocalDateTime getSlaDueAt() { return slaDueAt; }
    public Long getTechnicianId() { return technicianId; }
    public String getTechnicianUsername() { return technicianUsername; }
    public Long getCustomerId() { return customerId; }
    public Long getSiteId() { return siteId; }
}
