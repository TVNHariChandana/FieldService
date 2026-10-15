
package com.codewithme.fieldservice.repository;

import com.codewithme.fieldservice.model.Part;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PartRepository extends JpaRepository<Part, Long> {

    // Count parts with low stock (5 or fewer units)
    @Query("SELECT COUNT(p) FROM Part p WHERE p.stockQuantity <= 5")
    long countLowStockParts();

    // Count parts that are out of stock
    @Query("SELECT COUNT(p) FROM Part p WHERE p.stockQuantity = 0")
    long countOutOfStockParts();
}
