
package com.codewithme.fieldservice.model;

import jakarta.persistence.*;
        import lombok.Data;

@Entity
@Table(name = "work-order-parts")
@Data
public class WorkOrderPart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "work_order_id")
    private WorkOrder workOrder;

    @ManyToOne
    @JoinColumn(name = "part_id")
    private Part part;

    private Integer quantity;
}