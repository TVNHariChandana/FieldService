
package com.codewithme.fieldservice.service;

import com.codewithme.fieldservice.model.Attachment;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface AttachmentService {

    Attachment upload(MultipartFile file, String folder);

    Attachment uploadForWorkOrder(
            MultipartFile file,
            String folder,
            Long workOrderId
    );

    Attachment getById(Long id);

    void delete(Long id);


    // Add this method inside AttachmentService:
    List<Attachment> getByWorkOrderId(Long workOrderId);

}
