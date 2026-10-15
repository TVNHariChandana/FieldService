
package com.codewithme.fieldservice.service;

import com.codewithme.fieldservice.model.WorkOrderPart;
import com.codewithme.fieldservice.repository.WorkOrderPartRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkOrderPartService {

    private final WorkOrderPartRepository workOrderPartRepository;

    public WorkOrderPartService(WorkOrderPartRepository workOrderPartRepository) {
        this.workOrderPartRepository = workOrderPartRepository;
    }

    public List<WorkOrderPart> getAllWorkOrderParts() {
        return workOrderPartRepository.findAll();
    }

    public WorkOrderPart getWorkOrderPartById(Long id) {
        return workOrderPartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Work order part not found"));
    }

    public WorkOrderPart createWorkOrderPart(WorkOrderPart workOrderPart) {
        return workOrderPartRepository.save(workOrderPart);
    }

    public WorkOrderPart updateWorkOrderPart(Long id, WorkOrderPart workOrderPart) {
        WorkOrderPart existing = getWorkOrderPartById(id);

        existing.setWorkOrder(workOrderPart.getWorkOrder());
        existing.setPart(workOrderPart.getPart());
        existing.setQuantity(workOrderPart.getQuantity());

        return workOrderPartRepository.save(existing);
    }

    public void deleteWorkOrderPart(Long id) {
        workOrderPartRepository.deleteById(id);
    }
}