package com.codewithme.fieldservice.service;

import com.codewithme.fieldservice.model.WorkOrderAssignmentHistory;
import com.codewithme.fieldservice.repository.WorkOrderAssignmentHistoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkOrderAssignmentHistoryService {

    private final WorkOrderAssignmentHistoryRepository historyRepository;

    public WorkOrderAssignmentHistoryService(
            WorkOrderAssignmentHistoryRepository historyRepository) {

        this.historyRepository = historyRepository;
    }

    public List<WorkOrderAssignmentHistory> getHistoryByWorkOrderId(
            Long workOrderId) {

        return historyRepository.findByWorkOrderId(workOrderId);
    }
}
