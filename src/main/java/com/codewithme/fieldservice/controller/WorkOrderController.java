package com.codewithme.fieldservice.controller;

import com.codewithme.fieldservice.dto.AssignmentHistoryDTO;
import com.codewithme.fieldservice.dto.WorkOrderDTO;

import com.codewithme.fieldservice.model.WorkOrderStatus;
import com.codewithme.fieldservice.model.WorkOrderStatusHistory;
import com.codewithme.fieldservice.service.WorkOrderService;
import com.codewithme.fieldservice.model.WorkOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/work-orders")
public class WorkOrderController {

    private final WorkOrderService workOrderService;

    public WorkOrderController(WorkOrderService workOrderService) {
        this.workOrderService = workOrderService;
    }

    // Get all work orders
    @GetMapping
    public List<WorkOrder> getAllWorkOrders() {
        return workOrderService.getAllWorkOrders();
    }

    // Get one work order by ID
    @GetMapping("/{id:\\d+}")
    public ResponseEntity<WorkOrderDTO> getWorkOrderById(
            @PathVariable Long id) {

        WorkOrderDTO workOrder =
                workOrderService.getWorkOrderById(id);

        if (workOrder == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(workOrder);
    }

    // Pagination, sorting, filtering, and validation
    @GetMapping("/page")
    public ResponseEntity<?> getWorkOrdersPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(required = false) WorkOrderStatus status,
            @RequestParam(required = false) String priority) {

        // Validate page number
        if (page < 0) {
            return ResponseEntity.badRequest()
                    .body("Page must be 0 or greater");
        }

        // Validate page size
        if (size < 1 || size > 100) {
            return ResponseEntity.badRequest()
                    .body("Page size must be between 1 and 100");
        }

        // Validate sorting direction
        if (!direction.equalsIgnoreCase("asc")
                && !direction.equalsIgnoreCase("desc")) {
            return ResponseEntity.badRequest()
                    .body("Direction must be 'asc' or 'desc'");
        }

        // Allow only valid sort fields
        List<String> allowedSortFields = List.of(
                "id",
                "code",
                "title",
                "priority",
                "status",
                "slaDueAt"
        );

        if (!allowedSortFields.contains(sortBy)) {
            return ResponseEntity.badRequest()
                    .body("Invalid sortBy field");
        }

        // Create sorting configuration
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        // Create pagination configuration
        Pageable pageable = PageRequest.of(page, size, sort);

        // Fetch filtered and paginated work orders
        Page<WorkOrderDTO> result =
                workOrderService.getWorkOrdersPage(
                        pageable, status, priority);

        return ResponseEntity.ok(result);
    }

    // Get work orders by status
    @GetMapping("/status/{status}")
    public List<WorkOrder> getWorkOrdersByStatus(
            @PathVariable WorkOrderStatus status) {

        return workOrderService.getWorkOrdersByStatus(status);
    }

    // Get work orders by priority
    @GetMapping("/priority/{priority}")
    public List<WorkOrder> getWorkOrdersByPriority(
            @PathVariable String priority) {

        return workOrderService.getWorkOrdersByPriority(priority);
    }

// Assign a technician to a work order
    @PutMapping("/{id:\\d+}/assign/{technicianId:\\d+}")
    @PreAuthorize("hasAnyRole('MANAGER', 'DISPATCHER')")
    public ResponseEntity<WorkOrder> assignTechnician(
            @PathVariable Long id,
            @PathVariable Long technicianId) {

        WorkOrder assigned = workOrderService.assignTechnician(
                id,
                technicianId,
                null
        );

        if (assigned == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(assigned);
    }

    // Get assignment history
    @GetMapping("/{id:\\d+}/assignment-history")
    public List<AssignmentHistoryDTO> getAssignmentHistory(
            @PathVariable Long id) {

        return workOrderService.getAssignmentHistory(id);
    }
    // Get status history
    @GetMapping("/{id:\\d+}/status-history")
    public List<WorkOrderStatusHistory> getStatusHistory(
            @PathVariable Long id) {

        return workOrderService.getStatusHistory(id);
    }

    // Create a work order
    @PostMapping
    @PreAuthorize("hasAnyRole('MANAGER', 'DISPATCHER')")
    public ResponseEntity<WorkOrder> createWorkOrder(
            @RequestBody WorkOrder workOrder) {

        WorkOrder created =
                workOrderService.createWorkOrder(workOrder);

        return ResponseEntity.ok(created);
    }

    // Update a work order
    @PutMapping("/{id:\\d+}")
    @PreAuthorize("hasAnyRole('MANAGER', 'DISPATCHER')")
    public ResponseEntity<WorkOrder> updateWorkOrder(
            @PathVariable Long id,
            @RequestBody WorkOrder workOrder) {

        WorkOrder updated =
                workOrderService.updateWorkOrder(id, workOrder);

        if (updated == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updated);
    }
    // Update work order status
    @PutMapping("/{id:\\d+}/status")
    @PreAuthorize("hasAnyRole('MANAGER', 'DISPATCHER', 'TECHNICIAN')")
    public ResponseEntity<WorkOrder> updateWorkOrderStatus(
            @PathVariable Long id,
            @RequestParam WorkOrderStatus status,
            org.springframework.security.core.Authentication authentication) {

        WorkOrder updated = workOrderService.updateStatus(
                id,
                status,
                authentication.getName()
        );

        if (updated == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updated);
    }

    // Delete a work order
    @DeleteMapping("/{id:\\d+}")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<Void> deleteWorkOrder(
            @PathVariable Long id) {

        workOrderService.deleteWorkOrder(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Long>> getDashboardSummary() {
        return ResponseEntity.ok(workOrderService.getDashboardSummary());
    }
    @GetMapping("/my-work-orders")
    @PreAuthorize("hasRole('CUSTOMER')")
    public List<WorkOrder> getMyWorkOrders(Authentication authentication) {
        return workOrderService.getWorkOrdersForCustomerUsername(
                authentication.getName()
        );
    }

    @GetMapping("/search")
    public Page<WorkOrderDTO> searchWorkOrders(
            @RequestParam String keyword,
            @RequestParam(required = false) WorkOrderStatus status,
            @RequestParam(required = false) String priority,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        if (keyword == null || keyword.trim().isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Keyword must not be empty");
        }

        if (page < 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Page must be 0 or greater");
        }

        if (size < 1 || size > 100) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Page size must be between 1 and 100");
        }

        if (!List.of("id", "code", "title", "priority", "status", "slaDueAt")
                .contains(sortBy)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Invalid sort field");
        }

        if (!direction.equalsIgnoreCase("asc")
                && !direction.equalsIgnoreCase("desc")) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Direction must be asc or desc");
        }

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return workOrderService.searchWorkOrders(
                keyword.trim(), status, priority, pageable);
    }

}