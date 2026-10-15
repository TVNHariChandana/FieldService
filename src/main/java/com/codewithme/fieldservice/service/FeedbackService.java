
package com.codewithme.fieldservice.service;

import com.codewithme.fieldservice.model.Customer;
import com.codewithme.fieldservice.model.Feedback;
import com.codewithme.fieldservice.model.WorkOrder;
import com.codewithme.fieldservice.repository.CustomerRepository;
import com.codewithme.fieldservice.repository.FeedbackRepository;
import com.codewithme.fieldservice.repository.WorkOrderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final WorkOrderRepository workOrderRepository;
    private final CustomerRepository customerRepository;

    public FeedbackService(
            FeedbackRepository feedbackRepository,
            WorkOrderRepository workOrderRepository,
            CustomerRepository customerRepository) {

        this.feedbackRepository = feedbackRepository;
        this.workOrderRepository = workOrderRepository;
        this.customerRepository = customerRepository;
    }

    public Feedback createFeedback(
            Long workOrderId,
            Long customerId,
            Integer rating,
            String comment) {

        WorkOrder workOrder =
                workOrderRepository.findById(workOrderId)
                        .orElseThrow(() ->
                                new RuntimeException("Work order not found"));

        Customer customer =
                customerRepository.findById(customerId)
                        .orElseThrow(() ->
                                new RuntimeException("Customer not found"));

        // Feedback only after work order is closed
        if (workOrder.getStatus() !=
                com.codewithme.fieldservice.model.WorkOrderStatus.CLOSED) {

            throw new RuntimeException(
                    "Feedback can only be given for closed work orders");
        }

        // Make sure the work order belongs to this customer
        if (workOrder.getCustomer() == null ||
                !workOrder.getCustomer().getId().equals(customerId)) {

            throw new RuntimeException(
                    "You cannot give feedback for this work order");
        }

        // Only one feedback per work order
        if (feedbackRepository.existsByWorkOrderId(workOrderId)) {

            throw new RuntimeException(
                    "Feedback has already been submitted");
        }

        if (rating == null || rating < 1 || rating > 5) {
            throw new RuntimeException(
                    "Rating must be between 1 and 5");
        }

        Feedback feedback = new Feedback();

        feedback.setWorkOrder(workOrder);
        feedback.setCustomer(customer);
        feedback.setRating(rating);
        feedback.setComment(comment);
        feedback.setCreatedAt(LocalDateTime.now());

        return feedbackRepository.save(feedback);
    }

    public List<Feedback> getFeedbackByCustomer(Long customerId) {
        return feedbackRepository.findByCustomerId(customerId);
    }

    public List<Feedback> getFeedbackByWorkOrder(Long workOrderId) {
        return feedbackRepository.findByWorkOrderId(workOrderId);
    }
}