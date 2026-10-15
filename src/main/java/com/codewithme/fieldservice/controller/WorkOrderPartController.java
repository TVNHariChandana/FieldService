
package com.codewithme.fieldservice.controller;

import com.codewithme.fieldservice.model.WorkOrderPart;
import com.codewithme.fieldservice.service.WorkOrderPartService;
import org.springframework.web.bind.annotation.*;

        import java.util.List;

@RestController
@RequestMapping("/work-order-parts")
public class WorkOrderPartController {

    private final WorkOrderPartService workOrderPartService;

    public WorkOrderPartController(WorkOrderPartService workOrderPartService) {
        this.workOrderPartService = workOrderPartService;
    }

    @GetMapping
    public List<WorkOrderPart> getAllWorkOrderParts() {
        return workOrderPartService.getAllWorkOrderParts();
    }

    @GetMapping("/{id}")
    public WorkOrderPart getWorkOrderPartById(@PathVariable Long id) {
        return workOrderPartService.getWorkOrderPartById(id);
    }

    @PostMapping
    public WorkOrderPart createWorkOrderPart(
            @RequestBody WorkOrderPart workOrderPart) {
        return workOrderPartService.createWorkOrderPart(workOrderPart);
    }

    @PutMapping("/{id}")
    public WorkOrderPart updateWorkOrderPart(
            @PathVariable Long id,
            @RequestBody WorkOrderPart workOrderPart) {
        return workOrderPartService.updateWorkOrderPart(id, workOrderPart);
    }

    @DeleteMapping("/{id}")
    public void deleteWorkOrderPart(@PathVariable Long id) {
        workOrderPartService.deleteWorkOrderPart(id);
    }
}