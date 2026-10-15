package com.codewithme.fieldservice.controller;

import com.codewithme.fieldservice.model.serviceRequest;
import com.codewithme.fieldservice.service.serviceRequestService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/service-requests")
public class serviceRequestController {

    private final serviceRequestService serviceRequestService;

    public serviceRequestController(serviceRequestService serviceRequestService) {
        this.serviceRequestService = serviceRequestService;
    }

    @GetMapping
    public List<serviceRequest> getAllServiceRequests() {
        return serviceRequestService.getAllServiceRequests();
    }
    @GetMapping("/customer/{customerId}")
    public List<serviceRequest>getServiceRequestByCustomer(@PathVariable Long customerId){
        return serviceRequestService.getServiceRequestByCustomer(customerId);
    }
    @GetMapping("/status/{status}")
    public List<serviceRequest>getServiceRequestByStatus(@PathVariable String status){
        return serviceRequestService.getServiceRequestByStatus(status);
    }
    @GetMapping("/customer/{customerId}/status/{status}")
    public List<serviceRequest>getServiceRequestByCustomerAndStatus(@PathVariable Long customerId,@PathVariable String status){
    return serviceRequestService.getServiceRequestByCustomerAndStatus(customerId, status);

    }
    @GetMapping("/{id}")
    public serviceRequest getServiceRequestById(@PathVariable Long id) {
        return serviceRequestService.getServiceRequestById(id);
    }

    @PostMapping
    public serviceRequest createServiceRequest(
            @RequestBody serviceRequest serviceRequest) {
        return serviceRequestService.createServiceRequest(serviceRequest);
    }

    @PutMapping("/{id}")
    public serviceRequest updateServiceRequest(
            @PathVariable Long id,
            @RequestBody serviceRequest serviceRequest) {
        return serviceRequestService.updateServiceRequest(id, serviceRequest);
    }

    @DeleteMapping("/{id}")
    public void deleteServiceRequest(@PathVariable Long id) {
        serviceRequestService.deleteServiceRequest(id);
    }
    }