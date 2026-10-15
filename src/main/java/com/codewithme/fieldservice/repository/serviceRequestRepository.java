package com.codewithme.fieldservice.repository;

import com.codewithme.fieldservice.model.serviceRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface serviceRequestRepository  extends JpaRepository<serviceRequest,Long> {
List<serviceRequest> findByCustomerId(long customerId);
List<serviceRequest> findByStatus(String status);
List<serviceRequest> findByCustomerIdAndStatus(Long customerId,String status);
}
