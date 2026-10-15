
package com.codewithme.fieldservice.controller;

import com.codewithme.fieldservice.model.WorkOrderStatusHistory;
import com.codewithme.fieldservice.service.WorkOrderStatusHistoryService;
import org.springframework.web.bind.annotation.*;

        import java.util.List;

@RestController
@RequestMapping("/work-orders")
public class WorkOrderStatusHistoryController {

    private final WorkOrderStatusHistoryService historyService;

    public  WorkOrderStatusHistoryController(WorkOrderStatusHistoryService historyService) {

        this.historyService = historyService;
    }

    @GetMapping("/{workOrderId}/history")
    public List<WorkOrderStatusHistory> getHistory(
            @PathVariable Long workOrderId) {

        return historyService.getHistoryByWorkOrderId(workOrderId);
    }
}