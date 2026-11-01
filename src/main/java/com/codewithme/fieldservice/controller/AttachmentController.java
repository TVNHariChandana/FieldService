
package com.codewithme.fieldservice.controller;

import com.codewithme.fieldservice.model.Attachment;
import com.codewithme.fieldservice.service.AttachmentService;

import io.swagger.v3.oas.annotations.Operation;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/attachment")
public class AttachmentController {

    private final AttachmentService attachmentService;

    public AttachmentController(AttachmentService attachmentService) {
        this.attachmentService = attachmentService;
    }

    @Operation(summary = "Upload attachment for a work order")
    @PostMapping(
            value = "/upload/work-order/{workOrderId}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Attachment> uploadForWorkOrder(
            @PathVariable Long workOrderId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(defaultValue = "work-orders") String folder) {

        Attachment attachment = attachmentService.uploadForWorkOrder(
                file, folder, workOrderId);

        return ResponseEntity.ok(attachment);
    }

    @Operation(summary = "Get attachment by ID")
    @GetMapping("/{id}")
    public ResponseEntity<Attachment> getById(@PathVariable Long id) {
        return ResponseEntity.ok(attachmentService.getById(id));
    }

    @Operation(summary = "Download attachment")
    @GetMapping("/cloudDownload/{id}")
    public ResponseEntity<Void> download(@PathVariable Long id) {

        Attachment attachment = attachmentService.getById(id);

        return ResponseEntity.status(302)
                .header(HttpHeaders.LOCATION, attachment.getStoragePath())
                .build();
    }

    @Operation(summary = "Delete attachment")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteFile(@PathVariable Long id) {

        attachmentService.delete(id);
        return ResponseEntity.ok("File deleted successfully");
    }

    @GetMapping("/work-order/{workOrderId}")
    public ResponseEntity<List<Attachment>> getByWorkOrderId(
            @PathVariable Long workOrderId) {

        return ResponseEntity.ok(
                attachmentService.getByWorkOrderId(workOrderId)
        );
    }

}
