package com.codewithme.fieldservice.repository;

import com.codewithme.fieldservice.model.WorkOrderStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkOrderStatusHistoryRepository extends JpaRepository<WorkOrderStatusHistory,Long> {
    List<WorkOrderStatusHistory>findByWorkOrderId(Long workOrderId);

}
