
package com.codewithme.fieldservice.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.codewithme.fieldservice.model.*;
import com.codewithme.fieldservice.repository.*;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.Arrays;
import java.util.List;
import java.io.IOException;

@Service
public class AttachmentServiceImpl implements AttachmentService {
    private final CustomerRepository customerRepository;
    private final TechnicianRepository technicianRepository;
    private final UserAuthRepository userAuthRepository;
    private final AttachmentRepository attachmentRepository;
    private final Cloudinary cloudinary;
    private final WorkOrderRepository workOrderRepository;
    public AttachmentServiceImpl(
            CustomerRepository customerRepository, TechnicianRepository technicianRepository, UserAuthRepository userAuthRepository, AttachmentRepository attachmentRepository,
            Cloudinary cloudinary, WorkOrderRepository workOrderRepository) {
        this.customerRepository = customerRepository;
        this.technicianRepository = technicianRepository;
        this.userAuthRepository = userAuthRepository;
        this.attachmentRepository = attachmentRepository;
        this.cloudinary = cloudinary;
        this.workOrderRepository = workOrderRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Attachment> getByWorkOrderId(Long workOrderId) {

        WorkOrder workOrder = workOrderRepository.findById(workOrderId)
                .orElseThrow(() ->
                        new org.springframework.web.server.ResponseStatusException(
                                org.springframework.http.HttpStatus.NOT_FOUND,
                                "Work order not found"));

        checkWorkOrderAccess(workOrder);

        return attachmentRepository.findByWorkOrder_Id(workOrderId);
    }

    @Override
    @Transactional
    public Attachment uploadForWorkOrder(
            MultipartFile file,
            String folder,
            Long workOrderId) {

        WorkOrder workOrder = workOrderRepository.findById(workOrderId)
                .orElseThrow(() ->
                        new org.springframework.web.server.ResponseStatusException(
                                org.springframework.http.HttpStatus.NOT_FOUND,
                                "Work order not found: " + workOrderId));
        checkWorkOrderAccess(workOrder);
        Attachment attachment = upload(file, folder);
        attachment.setWorkOrder(workOrder);

        return attachmentRepository.save(attachment);
    }
    @Override
    @Transactional
    public Attachment upload(MultipartFile file, String folder) {

        validateFile(file);

        try {
            String detectedType = new org.apache.tika.Tika()
                    .detect(file.getBytes());

            Map<?, ?> result = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", folder,
                            "resource_type", "auto"
                    )
            );

            Attachment attachment = Attachment.builder()
                    .fileName(file.getOriginalFilename())
                    .contentType(detectedType)
                    .sizeOfFile(file.getSize())
                    .storagePath((String) result.get("secure_url"))
                    .cloudinaryId((String) result.get("public_id"))
                    .build();

            return attachmentRepository.save(attachment);

        } catch (Exception e) {
            throw new RuntimeException("Cloudinary upload failed", e);
        }
    }
    @Override
    public Attachment getById(Long id) {

        Attachment attachment = attachmentRepository.findById(id)
                .orElseThrow(() ->
                        new org.springframework.web.server.ResponseStatusException(
                                org.springframework.http.HttpStatus.NOT_FOUND,
                                "Attachment not found: " + id));

        if (attachment.getWorkOrder() == null) {
            throw new AccessDeniedException(
                    "Attachment is not associated with a work order");
        }

        checkWorkOrderAccess(attachment.getWorkOrder());

        return attachment;
    }
    @Override
    @Transactional
    public void delete(Long id) {
        Authentication authentication = getAuthentication();

        if (!hasRole(authentication, Role.MANAGER)) {
            throw new AccessDeniedException(
                    "Only Manager can delete attachments");
        }
        Attachment attachment = getById(id);

        try {
            String resourceType = attachment.getContentType() != null
                    && attachment.getContentType().startsWith("video/")
                    ? "video"
                    : "image";

            Map<?, ?> result = cloudinary.uploader().destroy(
                    attachment.getCloudinaryId(),
                    ObjectUtils.asMap(
                            "resource_type", resourceType,
                            "invalidate", true
                    )
            );

            Object deletionResult = result.get("result");
            System.out.println("Cloudinary deletion result: " + result);
            if (!"ok".equals(deletionResult)
                    && !"not found".equals(deletionResult)) {
                throw new IllegalStateException(
                        "Cloudinary deletion was not confirmed: " + result
                );
            }

            attachmentRepository.delete(attachment);

        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to delete attachment from Cloudinary",
                    e
            );
        }
    }
    private Authentication getAuthentication() {
        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Please log in first");
        }

        return authentication;
    }

    private boolean hasRole(Authentication authentication, Role role) {
        return authentication.getAuthorities().stream()
                .anyMatch(authority ->
                        authority.getAuthority().equals("ROLE_" + role.name()));
    }

    private void checkWorkOrderAccess(WorkOrder workOrder) {

        Authentication authentication = getAuthentication();

        // Manager and Dispatcher can access all work orders.
        if (hasRole(authentication, Role.MANAGER)
                || hasRole(authentication, Role.DISPATCHER)) {
            return;
        }

        String username = authentication.getName();

        // Technician can access only assigned work orders.
        if (hasRole(authentication, Role.TECHNICIAN)) {

            Technician technician = technicianRepository
                    .findByUsername(username)
                    .orElseThrow(() ->
                            new AccessDeniedException("Technician not found"));

            if (workOrder.getTechnician() == null
                    || !workOrder.getTechnician().getId()
                    .equals(technician.getId())) {

                throw new AccessDeniedException(
                        "You can access only your assigned work orders");
            }

            return;
        }

        // Customer can access only their own work orders.
        if (hasRole(authentication, Role.CUSTOMER)) {

            UserAuth user = userAuthRepository.findByUsername(username)
                    .orElseThrow(() ->
                            new AccessDeniedException("User not found"));

            Customer customer = customerRepository.findByEmail(user.getEmail())
                    .orElseThrow(() ->
                            new AccessDeniedException("Customer record not found"));

            if (workOrder.getCustomer() == null
                    || !workOrder.getCustomer().getId()
                    .equals(customer.getId())) {

                throw new AccessDeniedException(
                        "You can access only your own work orders");
            }

            return;
        }

        throw new AccessDeniedException("You do not have permission");
    }
    private void validateFile(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }

        long maxSize = 10L * 1024 * 1024;

        if (file.getSize() > maxSize) {
            throw new IllegalArgumentException("Maximum file size is 10 MB");
        }

        String fileName = file.getOriginalFilename();

        if (fileName == null || !fileName.contains(".")) {
            throw new IllegalArgumentException("Invalid file name");
        }

        String extension = fileName.substring(
                fileName.lastIndexOf(".") + 1
        ).toLowerCase();

        try {
            String detectedType = new org.apache.tika.Tika()
                    .detect(file.getBytes());

            boolean valid =
                    (extension.equals("jpg") || extension.equals("jpeg"))
                            && detectedType.equals("image/jpeg")
                            || extension.equals("png")
                            && detectedType.equals("image/png")
                            || extension.equals("mp4")
                            && (detectedType.equals("video/mp4")
                            || detectedType.equals("application/mp4"));

            if (!valid) {
                throw new IllegalArgumentException(
                        "File content does not match an allowed PNG, JPEG, or MP4 file"
                );
            }

        } catch (IOException e) {
            throw new RuntimeException("Unable to validate file", e);
        }
    }
       private String getContentTypeFromExtension(String fileName) {
        String extension = fileName.substring(
                fileName.lastIndexOf(".") + 1
        ).toLowerCase();

        switch (extension) {
            case "jpg":
            case "jpeg":
                return "image/jpeg";
            case "png":
                return "image/png";
            case "mp4":
                return "video/mp4";
            default:
                throw new IllegalArgumentException("Unsupported file type");
        }
    }
    }
