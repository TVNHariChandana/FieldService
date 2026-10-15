package com.codewithme.fieldservice.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "service_requests")
@Data
public class serviceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    private String status;

    private String priority;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "site_id")
    private Site site;
}