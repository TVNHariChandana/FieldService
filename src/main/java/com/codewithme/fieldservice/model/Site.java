package com.codewithme.fieldservice.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name="sites")
@Data
public class Site {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;
    private String address;
    private String city;
    private String state;
    private String pincode;
    @ManyToOne
    @JoinColumn(name="cstomer_id")
    private Customer customer;
}
