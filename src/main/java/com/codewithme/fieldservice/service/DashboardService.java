package com.codewithme.fieldservice.service;

import com.codewithme.fieldservice.model.Part;
import com.codewithme.fieldservice.model.WorkOrder;
import com.codewithme.fieldservice.model.WorkOrderStatus;
import com.codewithme.fieldservice.repository.PartRepository;
import com.codewithme.fieldservice.repository.WorkOrderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DashboardService {

    private final WorkOrderRepository workOrderRepository;
    private final PartRepository partRepository;

    public DashboardService(
            WorkOrderRepository workOrderRepository,
            PartRepository partRepository) {

        this.workOrderRepository = workOrderRepository;
        this.partRepository = partRepository;
    }

    public long getTotalWorkOrders() {
        return workOrderRepository.count();
    }

    public long getOpenWorkOrders() {
        return workOrderRepository.countByStatus(WorkOrderStatus.NEW);
    }

    public long getInProgressWorkOrders() {
        return workOrderRepository.countByStatus(
                WorkOrderStatus.IN_PROGRESS
        );
    }

    public long getCompletedWorkOrders() {
        return workOrderRepository.countByStatus(
                WorkOrderStatus.COMPLETED
        );
    }

    public long getLowPriorityWorkOrders() {
        return workOrderRepository.countByPriority("LOW");
    }

    public long getMediumPriorityWorkOrders() {
        return workOrderRepository.countByPriority("MEDIUM");
    }

    public long getHighPriorityWorkOrders() {
        return workOrderRepository.countByPriority("HIGH");
    }

    public long getSlaBreachedCount() {

        List<WorkOrder> workOrders = workOrderRepository.findAll();

        return workOrders.stream()
                .filter(workOrder ->
                        workOrder.getSlaDueAt() != null &&
                                workOrder.getSlaDueAt().isBefore(LocalDateTime.now()) &&
                                workOrder.getStatus() != WorkOrderStatus.CLOSED
                )
                .count();
    }

    public long getTotalParts() {
        return partRepository.count();
    }

    public long getOutOfStockParts() {

        List<Part> parts = partRepository.findAll();

        return parts.stream()
                .filter(part ->
                        part.getStockQuantity() == null ||
                                part.getStockQuantity() <= 0
                )
                .count();
    }
}