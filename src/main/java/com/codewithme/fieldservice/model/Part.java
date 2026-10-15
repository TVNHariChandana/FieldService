package com.codewithme.fieldservice.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name="parts")
@Data

public class Part {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String partNumber;
    private Integer stockQuantity;
    private Double price;
    private Integer quantity;
}
