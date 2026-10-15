
        package com.codewithme.fieldservice.repository;

import com.codewithme.fieldservice.model.WorkOrder;
import com.codewithme.fieldservice.model.WorkOrderStatus;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface WorkOrderRepository
        extends JpaRepository<WorkOrder, Long> {

    // Filter work orders
    List<WorkOrder> findByStatus(WorkOrderStatus status);

    List<WorkOrder> findByPriority(String priority);

    List<WorkOrder> findByStatusAndPriority(
            WorkOrderStatus status, String priority);

    List<WorkOrder> findByTechnicianId(Long technicianId);

    List<WorkOrder> findByCustomerId(Long customerId);

    // Dashboard counts
    long countByStatus(WorkOrderStatus status);

    long countByPriority(String priority);

    @Query("""
    SELECT COUNT(w)
    FROM WorkOrder w
    WHERE w.slaDueAt < CURRENT_TIMESTAMP
      AND w.slaDueAt IS NOT NULL
      AND w.status NOT IN (
          com.codewithme.fieldservice.model.WorkOrderStatus.COMPLETED,
          com.codewithme.fieldservice.model.WorkOrderStatus.CLOSED,
          com.codewithme.fieldservice.model.WorkOrderStatus.CANCELLED
      )
    """)
    long countSlaBreachedWorkOrders();

    // Pagination and filtering
    Page<WorkOrder> findByStatus(
            WorkOrderStatus status, Pageable pageable);

    Page<WorkOrder> findByPriority(
            String priority, Pageable pageable);

    Page<WorkOrder> findByStatusAndPriority(
            WorkOrderStatus status,
            String priority,
            Pageable pageable);

    // Search by work-order title or code
    Page<WorkOrder> findByTitleContainingIgnoreCaseOrCodeContainingIgnoreCase(
            String title,
            String code,
            Pageable pageable);
    @Query("""
    SELECT w FROM WorkOrder w
    WHERE
        (LOWER(w.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
         OR LOWER(w.code) LIKE LOWER(CONCAT('%', :keyword, '%')))
        AND (:status IS NULL OR w.status = :status)
        AND (:priority IS NULL OR w.priority = :priority)
    """)
    Page<WorkOrder> searchWorkOrders(
            @Param("keyword") String keyword,
            @Param("status") WorkOrderStatus status,
            @Param("priority") String priority,
            Pageable pageable);
}
