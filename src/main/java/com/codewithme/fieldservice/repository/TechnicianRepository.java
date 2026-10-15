package com.codewithme.fieldservice.repository;

import com.codewithme.fieldservice.model.Technician;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TechnicianRepository  extends JpaRepository<Technician,Long> {
}
