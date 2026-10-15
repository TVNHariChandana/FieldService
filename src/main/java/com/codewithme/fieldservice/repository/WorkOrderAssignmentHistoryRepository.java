package com.codewithme.fieldservice.repository;

import com.codewithme.fieldservice.model.WorkOrderAssignmentHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkOrderAssignmentHistoryRepository extends JpaRepository<WorkOrderAssignmentHistory,Long> {
    List<WorkOrderAssignmentHistory> findByWorkOrderId(Long workOrderId);
}
