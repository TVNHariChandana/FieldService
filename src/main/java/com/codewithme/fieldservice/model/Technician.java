package com.codewithme.fieldservice.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Technicians")
@Data
public class Technician {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String email;

    private String username;

    private String phone;

    private String specialization;
}