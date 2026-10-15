package com.codewithme.fieldservice.service;

import com.codewithme.fieldservice.model.Customer;
import com.codewithme.fieldservice.model.serviceRequest;
import com.codewithme.fieldservice.repository.CustomerRepository;
import com.codewithme.fieldservice.repository.serviceRequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class serviceRequestService {

    private final serviceRequestRepository serviceRequestRepository;
    private final CustomerRepository customerRepository;

    public serviceRequestService(
            serviceRequestRepository serviceRequestRepository,
            CustomerRepository customerRepository) {

        this.serviceRequestRepository = serviceRequestRepository;
        this.customerRepository = customerRepository;
    }

    public List<serviceRequest> getAllServiceRequests() {
        return serviceRequestRepository.findAll();
    }
    public List<serviceRequest>getServiceRequestByCustomer(Long customerId){
        return serviceRequestRepository.findByCustomerId(customerId);
    }
    public List<serviceRequest>getServiceRequestByStatus(String status){
        return serviceRequestRepository.findByStatus(status);
    }
    public List<serviceRequest>getServiceRequestByCustomerAndStatus(Long customerId,String status){
        return serviceRequestRepository.findByCustomerIdAndStatus(customerId,status);
    }
    public serviceRequest getServiceRequestById(Long id) {
        return serviceRequestRepository.findById(id).orElse(null);
    }

    public serviceRequest createServiceRequest(serviceRequest serviceRequest) {

        Long customerId = serviceRequest.getCustomer().getId();

        Customer customer = customerRepository.findById(customerId).orElse(null);

        if (customer == null) {
            return null;
        }

        serviceRequest.setCustomer(customer);

        return serviceRequestRepository.save(serviceRequest);
    }

    public serviceRequest updateServiceRequest(
            Long id,
            serviceRequest serviceRequest) {

        serviceRequest existingRequest =
                serviceRequestRepository.findById(id).orElse(null);

        if (existingRequest != null) {

            existingRequest.setDescription(serviceRequest.getDescription());
            existingRequest.setStatus(serviceRequest.getStatus());
            existingRequest.setPriority(serviceRequest.getPriority());

            if (serviceRequest.getCustomer() != null) {

                Long customerId = serviceRequest.getCustomer().getId();

                Customer customer =
                        customerRepository.findById(customerId).orElse(null);

                if (customer != null) {
                    existingRequest.setCustomer(customer);
                }
            }

            return serviceRequestRepository.save(existingRequest);
        }

        return null;
    }

    public void deleteServiceRequest(Long id) {
        serviceRequestRepository.deleteById(id);
    }
}