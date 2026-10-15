package com.codewithme.fieldservice.service;

import com.codewithme.fieldservice.model.Part;
import com.codewithme.fieldservice.model.PartUsage;
import com.codewithme.fieldservice.model.WorkOrder;
import com.codewithme.fieldservice.repository.PartRepository;
import com.codewithme.fieldservice.repository.PartUsageRepository;
import com.codewithme.fieldservice.repository.WorkOrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PartUsageService {

    private final PartUsageRepository partUsageRepository;
    private final PartRepository partRepository;
    private final WorkOrderRepository workOrderRepository;

    public PartUsageService(
            PartUsageRepository partUsageRepository,
            PartRepository partRepository,
            WorkOrderRepository workOrderRepository) {

        this.partUsageRepository = partUsageRepository;
        this.partRepository = partRepository;
        this.workOrderRepository = workOrderRepository;
    }

    @Transactional
    public PartUsage usePart(Long workOrderId, Long partId, Integer quantityUsed) {

        // Validate quantity
        if (quantityUsed == null || quantityUsed <= 0) {
            throw new IllegalArgumentException("Quantity used must be greater than 0");
        }

        // Find work order
        WorkOrder workOrder = workOrderRepository.findById(workOrderId)
                .orElseThrow(() -> new RuntimeException("Work order not found"));

        // Find part
        Part part = partRepository.findById(partId)
                .orElseThrow(() -> new RuntimeException("Part not found"));

        // Check available stock
        if (part.getStockQuantity() == null ||
                part.getStockQuantity() < quantityUsed) {

            throw new RuntimeException("Insufficient stock");
        }

        // Decrease stock
        part.setStockQuantity(
                part.getStockQuantity() - quantityUsed
        );

        partRepository.save(part);

        // Create usage record
        PartUsage partUsage = new PartUsage();
        partUsage.setQuantityUsed(quantityUsed);
        partUsage.setPart(part);
        partUsage.setWorkOrder(workOrder);

        return partUsageRepository.save(partUsage);
    }

    public List<PartUsage> getPartsUsedByWorkOrder(Long workOrderId) {
        return partUsageRepository.findByWorkOrderId(workOrderId);
    }
}