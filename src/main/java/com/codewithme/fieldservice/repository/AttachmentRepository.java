
package com.codewithme.fieldservice.repository;

import com.codewithme.fieldservice.model.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface AttachmentRepository extends JpaRepository<Attachment, Long> {
    List<Attachment> findByWorkOrder_Id(Long workOrderId);
}
