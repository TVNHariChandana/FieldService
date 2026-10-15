
package com.codewithme.fieldservice.controller;

import com.codewithme.fieldservice.model.WorkOrderAssignmentHistory;
import com.codewithme.fieldservice.service.WorkOrderAssignmentHistoryService;
import org.springframework.web.bind.annotation.*;

        import java.util.List;

@RestController
@RequestMapping("/work-orders")
public class WorkOrderAssignmentHistoryController {

    private final WorkOrderAssignmentHistoryService historyService;

    public WorkOrderAssignmentHistoryController(
            WorkOrderAssignmentHistoryService historyService) {

        this.historyService = historyService;
    }

    @GetMapping("/{workOrderId}/assignments")
    public List<WorkOrderAssignmentHistory> getAssignmentHistory(
            @PathVariable Long workOrderId) {

        return historyService.getHistoryByWorkOrderId(workOrderId);
    }
}