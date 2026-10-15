package com.codewithme.fieldservice.repository;

import com.codewithme.fieldservice.model.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssignmentRepository extends JpaRepository<Assignment,Long> {
    List<Assignment>findByStatus(String status);
    List<Assignment>findByTechnicianId(Long TechnicianId);
    List<Assignment>findByTechnicianIdAndStatus(Long technicianId,String status);

}
