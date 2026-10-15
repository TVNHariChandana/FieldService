
package com.codewithme.fieldservice.repository;

import com.codewithme.fieldservice.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    List<Feedback> findByCustomerId(Long customerId);

    List<Feedback> findByWorkOrderId(Long workOrderId);

    boolean existsByWorkOrderId(Long workOrderId);
}