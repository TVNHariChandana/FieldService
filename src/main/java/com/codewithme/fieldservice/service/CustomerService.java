package com.codewithme.fieldservice.service;

import com.codewithme.fieldservice.model.Customer;
import com.codewithme.fieldservice.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

    @Service
    public class CustomerService {

        private final CustomerRepository customerRepository;

        public CustomerService(CustomerRepository customerRepository) {
            this.customerRepository = customerRepository;
        }

        public List<Customer> getAllCustomers() {
            return customerRepository.findAll();
        }

        public Customer getCustomerById(Long id) {
            return customerRepository.findById(id).orElse(null);
        }

        public Customer createCustomer(Customer customer) {
            return customerRepository.save(customer);
        }

        public Customer updateCustomer(Long id, Customer customer) {
            Customer existingCustomer = customerRepository.findById(id).orElse(null);

            if (existingCustomer != null) {
                existingCustomer.setName(customer.getName());
                existingCustomer.setEmail(customer.getEmail());
                existingCustomer.setPhone(customer.getPhone());

                return customerRepository.save(existingCustomer);
            }

            return null;
        }

        public void deleteCustomer(Long id) {
            customerRepository.deleteById(id);
        }
    }


