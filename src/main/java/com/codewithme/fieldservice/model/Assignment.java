package com.codewithme.fieldservice.model;

import jakarta.persistence.*;
import lombok.Data;
@Entity
@Table(name="assignments")
@Data

public class Assignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "service_request_id")
    private serviceRequest serviceRequest;
    @ManyToOne
    @JoinColumn(name="technician_id")
    private Technician technician;
    private String status;
}
