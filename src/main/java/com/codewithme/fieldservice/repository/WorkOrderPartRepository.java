package com.codewithme.fieldservice.repository;

import com.codewithme.fieldservice.model.WorkOrderPart;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkOrderPartRepository extends JpaRepository<WorkOrderPart,Long> {
}
