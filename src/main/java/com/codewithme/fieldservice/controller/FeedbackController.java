
package com.codewithme.fieldservice.controller;

import com.codewithme.fieldservice.model.Feedback;
import com.codewithme.fieldservice.service.FeedbackService;
import org.springframework.web.bind.annotation.*;

        import java.util.List;

@RestController
@RequestMapping("/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping("/work-order/{workOrderId}/customer/{customerId}")
    public Feedback createFeedback(
            @PathVariable Long workOrderId,
            @PathVariable Long customerId,
            @RequestParam Integer rating,
            @RequestParam(required = false) String comment) {

        return feedbackService.createFeedback(
                workOrderId,
                customerId,
                rating,
                comment
        );
    }

    @GetMapping("/customer/{customerId}")
    public List<Feedback> getCustomerFeedback(
            @PathVariable Long customerId) {

        return feedbackService.getFeedbackByCustomer(customerId);
    }

    @GetMapping("/work-order/{workOrderId}")
    public List<Feedback> getWorkOrderFeedback(
            @PathVariable Long workOrderId) {

        return feedbackService.getFeedbackByWorkOrder(workOrderId);
    }
}