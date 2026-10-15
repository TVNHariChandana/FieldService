
package com.codewithme.fieldservice.service;

import com.codewithme.fieldservice.model.WorkOrderStatusHistory;
import com.codewithme.fieldservice.repository.WorkOrderStatusHistoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkOrderStatusHistoryService {

    private final WorkOrderStatusHistoryRepository historyRepository;

    public WorkOrderStatusHistoryService(
            WorkOrderStatusHistoryRepository historyRepository) {

        this.historyRepository = historyRepository;
    }

    public List<WorkOrderStatusHistory> getHistoryByWorkOrderId(
            Long workOrderId) {

        return historyRepository.findByWorkOrderId(workOrderId);
    }
}