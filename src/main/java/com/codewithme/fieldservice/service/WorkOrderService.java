package com.codewithme.fieldservice.service;

import com.codewithme.fieldservice.dto.AssignmentHistoryDTO;
import com.codewithme.fieldservice.dto.WorkOrderDTO;
import com.codewithme.fieldservice.model.*;
import com.codewithme.fieldservice.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class WorkOrderService {

    private final WorkOrderRepository workOrderRepository;
    private final TechnicianRepository technicianRepository;
    private final WorkOrderStatusHistoryRepository statusHistoryRepository;
    private final WorkOrderAssignmentHistoryRepository assignmentHistoryRepository;
    private final CustomerRepository customerRepository;
    private final UserAuthRepository userAuthRepository;
    private final PartRepository partRepository;

    public WorkOrderService(
            WorkOrderRepository workOrderRepository,
            TechnicianRepository technicianRepository,
            WorkOrderStatusHistoryRepository statusHistoryRepository,
            WorkOrderAssignmentHistoryRepository assignmentHistoryRepository,
            CustomerRepository customerRepository,
            UserAuthRepository userAuthRepository,
            PartRepository partRepository) {

        this.workOrderRepository = workOrderRepository;
        this.technicianRepository = technicianRepository;
        this.statusHistoryRepository = statusHistoryRepository;
        this.assignmentHistoryRepository = assignmentHistoryRepository;
        this.customerRepository = customerRepository;
        this.userAuthRepository = userAuthRepository;
        this.partRepository = partRepository;
    }

    // Dashboard summary
    public Map<String, Long> getDashboardSummary() {

        Map<String, Long> summary = new LinkedHashMap<>();

        summary.put("totalWorkOrders", workOrderRepository.count());
        summary.put("newWorkOrders",
                workOrderRepository.countByStatus(WorkOrderStatus.NEW));
        summary.put("assignedWorkOrders",
                workOrderRepository.countByStatus(WorkOrderStatus.ASSIGNED));
        summary.put("inProgressWorkOrders",
                workOrderRepository.countByStatus(WorkOrderStatus.IN_PROGRESS));
        summary.put("onHoldWorkOrders",
                workOrderRepository.countByStatus(WorkOrderStatus.ON_HOLD));
        summary.put("completedWorkOrders",
                workOrderRepository.countByStatus(WorkOrderStatus.COMPLETED));
        summary.put("closedWorkOrders",
                workOrderRepository.countByStatus(WorkOrderStatus.CLOSED));

        summary.put("highPriorityWorkOrders",
                workOrderRepository.countByPriority("HIGH"));
        summary.put("mediumPriorityWorkOrders",
                workOrderRepository.countByPriority("MEDIUM"));
        summary.put("lowPriorityWorkOrders",
                workOrderRepository.countByPriority("LOW"));

        summary.put("slaBreachedWorkOrders",
                workOrderRepository.countSlaBreachedWorkOrders());

        summary.put("totalParts", partRepository.count());
        summary.put("lowStockParts", partRepository.countLowStockParts());
        summary.put("outOfStockParts", partRepository.countOutOfStockParts());

        return summary;
    }

    // Get work orders belonging to a customer username
    public List<WorkOrder> getWorkOrdersForCustomerUsername(String username) {

        UserAuth user = userAuthRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != Role.CUSTOMER) {
            throw new RuntimeException("Access denied: Customer role required");
        }

        Customer customer = customerRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        return workOrderRepository.findByCustomerId(customer.getId());
    }

    // Get all work orders
    public List<WorkOrder> getAllWorkOrders() {
        return workOrderRepository.findAll();
    }

    // Get work orders by status
    public List<WorkOrder> getWorkOrdersByStatus(WorkOrderStatus status) {
        return workOrderRepository.findByStatus(status);
    }

    // Get work orders by priority
    public List<WorkOrder> getWorkOrdersByPriority(String priority) {
        return workOrderRepository.findByPriority(priority);
    }

    // Get work orders by status and priority
    public List<WorkOrder> getWorkOrderByStatusAndPriority(
            WorkOrderStatus status,
            String priority) {

        return workOrderRepository.findByStatusAndPriority(status, priority);
    }

    // Get work orders by technician
    public List<WorkOrder> getWorkOrdersByTechnician(Long technicianId) {
        return workOrderRepository.findByTechnicianId(technicianId);
    }

    // Get work orders by customer
    public List<WorkOrder> getWorkOrdersByCustomer(Long customerId) {
        return workOrderRepository.findByCustomerId(customerId);
    }

    // Get work order by ID
    public WorkOrderDTO getWorkOrderById(Long id) {

        WorkOrder workOrder = workOrderRepository.findById(id).orElse(null);

        return workOrder == null ? null : toDTO(workOrder);
    }

    // Get paginated work orders
    public Page<WorkOrderDTO> getWorkOrdersPage(
            Pageable pageable,
            WorkOrderStatus status,
            String priority) {

        Page<WorkOrder> workOrders;
        boolean hasPriority = priority != null && !priority.isBlank();

        if (status != null && hasPriority) {
            workOrders = workOrderRepository.findByStatusAndPriority(
                    status, priority, pageable);
        } else if (status != null) {
            workOrders = workOrderRepository.findByStatus(status, pageable);
        } else if (hasPriority) {
            workOrders = workOrderRepository.findByPriority(priority, pageable);
        } else {
            workOrders = workOrderRepository.findAll(pageable);
        }

        return workOrders.map(this::toDTO);
    }

    // Convert WorkOrder entity to DTO
    private WorkOrderDTO toDTO(WorkOrder workOrder) {

        return new WorkOrderDTO(
                workOrder.getId(),
                workOrder.getCode(),
                workOrder.getTitle(),
                workOrder.getDescription(),
                workOrder.getPriority(),
                workOrder.getStatus(),
                workOrder.getSlaDueAt(),
                workOrder.getTechnician() != null
                        ? workOrder.getTechnician().getId() : null,
                workOrder.getTechnician() != null
                        ? workOrder.getTechnician().getUsername() : null,
                workOrder.getCustomer() != null
                        ? workOrder.getCustomer().getId() : null,
                workOrder.getSite() != null
                        ? workOrder.getSite().getId() : null
        );
    }

    // Get status history for a work order
    public List<WorkOrderStatusHistory> getStatusHistory(Long workOrderId) {
        return statusHistoryRepository.findByWorkOrderId(workOrderId);
    }

    // Get assignment history for a work order
    public List<AssignmentHistoryDTO> getAssignmentHistory(Long workOrderId) {

        return assignmentHistoryRepository.findByWorkOrderId(workOrderId)
                .stream()
                .map(history -> new AssignmentHistoryDTO(
                        history.getId(),
                        history.getWorkOrder().getId(),
                        history.getWorkOrder().getCode(),
                        history.getTechnician().getId(),
                        history.getTechnician().getUsername(),
                        history.getAssignedAt()
                ))
                .toList();
    }

    // Create work order
    public WorkOrder createWorkOrder(WorkOrder workOrder) {
        return workOrderRepository.save(workOrder);
    }

    // Delete work order
    public void deleteWorkOrder(Long id) {
        workOrderRepository.deleteById(id);
    }

    // Update work order status with authorization and transition checks
    @Transactional
    public WorkOrder updateStatus(
            Long workOrderId,
            WorkOrderStatus newStatus,
            String loggedInUsername) throws AccessDeniedException {

        WorkOrder workOrder = workOrderRepository.findById(workOrderId)
                .orElse(null);

        if (workOrder == null) {
            return null;
        }

        WorkOrderStatus currentStatus = workOrder.getStatus();

        var authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        // Only a Manager can close a work order
        if (newStatus == WorkOrderStatus.CLOSED) {

            boolean isManager = authentication != null
                    && authentication.isAuthenticated()
                    && authentication.getAuthorities()
                    .stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_MANAGER"));

            if (!isManager) {
                throw new AccessDeniedException(
                        "Only a Manager can close a work order");
            }
        }

        // Only the assigned Technician can start or complete a work order
        boolean technicianTransition =
                (currentStatus == WorkOrderStatus.ASSIGNED
                        && newStatus == WorkOrderStatus.IN_PROGRESS)
                        || (currentStatus == WorkOrderStatus.IN_PROGRESS
                        && newStatus == WorkOrderStatus.COMPLETED)
                        || (currentStatus == WorkOrderStatus.ON_HOLD
                        && newStatus == WorkOrderStatus.IN_PROGRESS);

        if (technicianTransition) {

            boolean isTechnician = authentication != null
                    && authentication.isAuthenticated()
                    && authentication.getAuthorities()
                    .stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_TECHNICIAN"));

            if (isTechnician
                    && (workOrder.getTechnician() == null
                    || workOrder.getTechnician().getUsername() == null
                    || !workOrder.getTechnician().getUsername()
                    .equals(loggedInUsername))) {

                throw new AccessDeniedException(
                        "Only the assigned technician can update this work order");
            }
        }

        // Validate allowed status transitions
        boolean validTransition =
                (currentStatus == WorkOrderStatus.NEW
                        && newStatus == WorkOrderStatus.ASSIGNED)
                        || (currentStatus == WorkOrderStatus.ASSIGNED
                        && newStatus == WorkOrderStatus.IN_PROGRESS)
                        || (currentStatus == WorkOrderStatus.IN_PROGRESS
                        && newStatus == WorkOrderStatus.ON_HOLD)
                        || (currentStatus == WorkOrderStatus.ON_HOLD
                        && newStatus == WorkOrderStatus.IN_PROGRESS)
                        || (currentStatus == WorkOrderStatus.IN_PROGRESS
                        && newStatus == WorkOrderStatus.COMPLETED)
                        || (currentStatus == WorkOrderStatus.COMPLETED
                        && newStatus == WorkOrderStatus.CLOSED);

        if (!validTransition) {
            throw new IllegalStateException(
                    "Invalid status transition from "
                            + currentStatus + " to " + newStatus);
        }

        // Create status history
        WorkOrderStatusHistory history = new WorkOrderStatusHistory();

        history.setFromStatus(currentStatus);
        history.setToStatus(newStatus);
        history.setChangedBy(loggedInUsername);
        history.setChangedAt(LocalDateTime.now());
        history.setWorkOrder(workOrder);

        statusHistoryRepository.save(history);

        // Update work order status
        workOrder.setStatus(newStatus);

        return workOrderRepository.save(workOrder);
    }

    // Assign a technician to a work order
    @Transactional
    public WorkOrder assignTechnician(
            Long workOrderId,
            Long technicianId,
            String loggedInUsername) {

        WorkOrder workOrder = workOrderRepository.findById(workOrderId)
                .orElse(null);

        if (workOrder == null) {
            return null;
        }

        Technician technician = technicianRepository.findById(technicianId)
                .orElse(null);

        if (technician == null) {
            return null;
        }

        WorkOrderStatus currentStatus = workOrder.getStatus();

        if (currentStatus == WorkOrderStatus.CLOSED
                || currentStatus == WorkOrderStatus.CANCELLED) {
            throw new IllegalStateException(
                    "Cannot assign a closed or cancelled work order");
        }

        if (currentStatus == WorkOrderStatus.ASSIGNED
                && workOrder.getTechnician() != null
                && workOrder.getTechnician().getId().equals(technicianId)) {
            throw new IllegalStateException(
                    "This technician is already assigned to the work order");
        }

        // Assign technician
        workOrder.setTechnician(technician);
        workOrder.setStatus(WorkOrderStatus.ASSIGNED);

        // Save assignment history
        WorkOrderAssignmentHistory assignmentHistory =
                new WorkOrderAssignmentHistory();

        assignmentHistory.setAssignedAt(LocalDateTime.now());
        assignmentHistory.setWorkOrder(workOrder);
        assignmentHistory.setTechnician(technician);

        assignmentHistoryRepository.save(assignmentHistory);

        // Save status history only when the status changes
        if (currentStatus != WorkOrderStatus.ASSIGNED) {

            WorkOrderStatusHistory history = new WorkOrderStatusHistory();

            history.setFromStatus(currentStatus);
            history.setToStatus(WorkOrderStatus.ASSIGNED);
            history.setChangedBy(loggedInUsername);
            history.setChangedAt(LocalDateTime.now());
            history.setWorkOrder(workOrder);

            statusHistoryRepository.save(history);
        }

        return workOrderRepository.save(workOrder);
    }

    // Calculate SLA based on priority
    public WorkOrder calculateSla(Long workOrderId) {

        WorkOrder workOrder = workOrderRepository.findById(workOrderId)
                .orElse(null);

        if (workOrder == null) {
            return null;
        }

        LocalDateTime createdAt = LocalDateTime.now();

        switch (workOrder.getPriority().toUpperCase()) {

            case "LOW":
                workOrder.setSlaDueAt(createdAt.plusHours(48));
                break;

            case "MEDIUM":
                workOrder.setSlaDueAt(createdAt.plusHours(24));
                break;

            case "HIGH":
                workOrder.setSlaDueAt(createdAt.plusHours(8));
                break;

            case "CRITICAL":
                workOrder.setSlaDueAt(createdAt.plusHours(4));
                break;

            default:
                return null;
        }

        return workOrderRepository.save(workOrder);
    }

    // Check whether SLA has been breached
    public boolean isSlaBreached(Long workOrderId) {

        WorkOrder workOrder = workOrderRepository.findById(workOrderId)
                .orElse(null);

        if (workOrder == null || workOrder.getSlaDueAt() == null) {
            return false;
        }

        return LocalDateTime.now().isAfter(workOrder.getSlaDueAt());
    }

    // Update work order details
    public WorkOrder updateWorkOrder(
            Long id,
            WorkOrder updatedWorkOrder) {

        WorkOrder existingWorkOrder = workOrderRepository.findById(id)
                .orElse(null);

        if (existingWorkOrder == null) {
            return null;
        }

        existingWorkOrder.setCode(updatedWorkOrder.getCode());
        existingWorkOrder.setTitle(updatedWorkOrder.getTitle());
        existingWorkOrder.setDescription(updatedWorkOrder.getDescription());
        existingWorkOrder.setPriority(updatedWorkOrder.getPriority());
        existingWorkOrder.setSlaDueAt(updatedWorkOrder.getSlaDueAt());

        return workOrderRepository.save(existingWorkOrder);
    }

    // Search work orders
    public Page<WorkOrderDTO> searchWorkOrders(
            String keyword,
            WorkOrderStatus status,
            String priority,
            Pageable pageable) {

        return workOrderRepository
                .searchWorkOrders(keyword, status, priority, pageable)
                .map(this::toDTO);
    }
}
