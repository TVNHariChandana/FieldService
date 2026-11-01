
package com.codewithme.fieldservice.service;

import com.codewithme.fieldservice.dto.ChatConversationResponse;
import com.codewithme.fieldservice.dto.ChatMessageResponse;
import com.codewithme.fieldservice.model.ChatConversation;
import com.codewithme.fieldservice.model.ChatMessage;
import com.codewithme.fieldservice.model.Role;
import com.codewithme.fieldservice.model.WorkOrder;
import com.codewithme.fieldservice.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static java.util.Arrays.stream;

@Service
public class ChatConversationService {
    private final TechnicianRepository technicianRepository;
    private final CustomerRepository customerRepository;
    private final UserAuthRepository userAuthRepository;
    private final ChatConversationRepository conversationRepository;
    private final ChatMessageRepository messageRepository;
    private final WorkOrderRepository workOrderRepository;
    private ChatMessageResponse toMessageResponse(ChatMessage chatMessage) {
        return new ChatMessageResponse(
                chatMessage.getId(),
                chatMessage.getConversation().getId(),
                chatMessage.getMessage(),
                chatMessage.getSenderUsername(),
                chatMessage.getSentAt()
        );
    }
    public ChatConversationService(
            TechnicianRepository technicianRepository, CustomerRepository customerRepository, UserAuthRepository userAuthRepository, ChatConversationRepository conversationRepository,
            ChatMessageRepository messageRepository,
            WorkOrderRepository workOrderRepository) {
        this.technicianRepository = technicianRepository;
        this.customerRepository = customerRepository;
        this.userAuthRepository = userAuthRepository;
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.workOrderRepository = workOrderRepository;
    }
    private ChatConversationResponse toConversationResponse(
            ChatConversation conversation) {

        return new ChatConversationResponse(
                conversation.getId(),
                conversation.getSubject(),
                conversation.getWorkOrder().getId(),
                conversation.getCreatedAt()
        );
    }
    public ChatConversationResponse createConversation(
            Long workOrderId,
            String subject,
            String username) {

        WorkOrder workOrder = workOrderRepository.findById(workOrderId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Work order not found: " + workOrderId
                ));

        checkWorkOrderAccess(workOrder, username);

        ChatConversation conversation = ChatConversation.builder()
                .subject(subject)
                .workOrder(workOrder)
                .build();

        ChatConversation saved = conversationRepository.save(conversation);

        return toConversationResponse(saved);
    }
    public List<ChatConversationResponse> getAllConversations(
            String username) {

        return conversationRepository.findAll()
                .stream()
                .filter(conversation -> {
                    try {
                        checkWorkOrderAccess(
                                conversation.getWorkOrder(),
                                username
                        );
                        return true;
                    } catch (AccessDeniedException exception) {
                        return false;
                    }
                })
                .map(this::toConversationResponse)
                .toList();
    }

    private ChatConversation getConversationEntity(Long id) {
        return conversationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Conversation not found: " + id
                ));
    }
    @Transactional(readOnly = true)
    public ChatConversationResponse getConversation(
            Long id,
            String username) {

        ChatConversation conversation = getConversationEntity(id);

        checkWorkOrderAccess(conversation.getWorkOrder(), username);

        return toConversationResponse(conversation);
    }
    public List<ChatMessageResponse> getMessages(
            Long conversationId,
            String username) {

        ChatConversation conversation =
                getConversationEntity(conversationId);

        checkWorkOrderAccess(conversation.getWorkOrder(), username);

        return messageRepository
                .findByConversationIdOrderBySentAtAsc(conversationId)
                .stream()
                .map(this::toMessageResponse)
                .toList();
    }

    @Transactional
    public ChatMessageResponse sendMessage(
            Long conversationId,
            String message,
            String senderUsername) {

        ChatConversation conversation =
                getConversationEntity(conversationId);

        checkWorkOrderAccess(
                conversation.getWorkOrder(),
                senderUsername
        );

        ChatMessage chatMessage = ChatMessage.builder()
                .conversation(conversation)
                .message(message)
                .senderUsername(senderUsername)
                .build();

        ChatMessage savedMessage =
                messageRepository.save(chatMessage);

        return toMessageResponse(savedMessage);
    }

    private void checkWorkOrderAccess(
            WorkOrder workOrder,
            String username) {

        var user = userAuthRepository.findByUsername(username)
                .orElseThrow(() ->
                        new AccessDeniedException("User account not found"));

        Role role = user.getRole();

        if (role == Role.MANAGER || role == Role.DISPATCHER) {
            return;
        }

        if (role == Role.TECHNICIAN) {
            var technician = technicianRepository
                    .findByUsername(username)
                    .orElseThrow(() ->
                            new AccessDeniedException(
                                    "Technician profile not found"));

            if (workOrder.getTechnician() == null
                    || !workOrder.getTechnician().getId()
                    .equals(technician.getId())) {
                throw new AccessDeniedException(
                        "You cannot access this work order");
            }

            return;
        }
        if (role == Role.CUSTOMER) {

            System.out.println("Logged-in username: " + username);
            System.out.println("User email: " + user.getEmail());

            var customer = customerRepository
                    .findByEmail(user.getEmail())
                    .orElseThrow(() ->
                            new AccessDeniedException(
                                    "Customer profile not found"));

            System.out.println("Customer ID: " + customer.getId());

            System.out.println("WorkOrder Customer ID: "
                    + (workOrder.getCustomer() != null
                    ? workOrder.getCustomer().getId()
                    : "NULL"));

            if (workOrder.getCustomer() == null
                    || !workOrder.getCustomer().getId()
                    .equals(customer.getId())) {
                throw new AccessDeniedException(
                        "You cannot access this work order");
            }

            return;
        }


        throw new AccessDeniedException("Access denied");
    }
}