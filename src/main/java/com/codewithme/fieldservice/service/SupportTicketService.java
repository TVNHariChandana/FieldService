
package com.codewithme.fieldservice.service;

import com.codewithme.fieldservice.dto.CreateSupportTicketRequest;
import com.codewithme.fieldservice.dto.SupportTicketResponse;
import com.codewithme.fieldservice.dto.SendSupportMessageRequest;
import com.codewithme.fieldservice.dto.SupportMessageResponse;

import com.codewithme.fieldservice.model.Customer;
import com.codewithme.fieldservice.model.Role;
import com.codewithme.fieldservice.model.SupportTicket;
import com.codewithme.fieldservice.model.SupportTicketStatus;
import com.codewithme.fieldservice.model.SupportMessage;
import com.codewithme.fieldservice.model.UserAuth;

import com.codewithme.fieldservice.repository.CustomerRepository;
import com.codewithme.fieldservice.repository.SupportTicketRepository;
import com.codewithme.fieldservice.repository.SupportMessageRepository;
import com.codewithme.fieldservice.repository.UserAuthRepository;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
@Service
public class SupportTicketService {

    private final SupportTicketRepository ticketRepository;
    private final SupportMessageRepository messageRepository;
    private final CustomerRepository customerRepository;
    private final UserAuthRepository userAuthRepository;
    private final NotificationService notificationService;
    public SupportTicketService(
            SupportTicketRepository ticketRepository,
            SupportMessageRepository messageRepository,
            CustomerRepository customerRepository,
            UserAuthRepository userAuthRepository, NotificationService notificationService) {

        this.ticketRepository = ticketRepository;
        this.messageRepository = messageRepository;
        this.customerRepository = customerRepository;
        this.userAuthRepository = userAuthRepository;
        this.notificationService = notificationService;
    }

    // Customer creates a support ticket
    @Transactional
    public SupportTicketResponse createTicket(
            CreateSupportTicketRequest request,
            String username) {

        UserAuth user = getUser(username);
        requireCustomer(user);

        Customer customer = getCustomer(user);

        SupportTicket ticket = SupportTicket.builder()
                .subject(request.getSubject())
                .description(request.getDescription())
                .customer(customer)
                .status(SupportTicketStatus.OPEN)
                .build();

        SupportTicket savedTicket = ticketRepository.save(ticket);

        // Notify all Managers
        List<UserAuth> managers = userAuthRepository.findByRole(Role.MANAGER);

        for (UserAuth manager : managers) {
            notificationService.createNotification(
                    manager.getId(),
                    "New Support Ticket",
                    "A customer has created a new support ticket: "
                            + savedTicket.getSubject(),
                    "SUPPORT",
                    savedTicket.getId()
            );
        }

        return toResponse(savedTicket);
    }
    // Customer views their own tickets
    @Transactional(readOnly = true)
    public List<SupportTicketResponse> getMyTickets(String username) {

        UserAuth user = getUser(username);
        requireCustomer(user);

        Customer customer = getCustomer(user);

        return ticketRepository
                .findByCustomerIdOrderByCreatedAtDesc(customer.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // Manager views all customer tickets
    @Transactional(readOnly = true)
    public List<SupportTicketResponse> getAllTickets(String username) {

        UserAuth user = getUser(username);
        requireManager(user);

        return ticketRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // Manager updates ticket status
    @Transactional
    public SupportTicketResponse updateStatus(
            Long ticketId,
            SupportTicketStatus status,
            String username) {

        UserAuth user = getUser(username);
        requireManager(user);

        SupportTicket ticket = getTicket(ticketId);

        ticket.setStatus(status);
        ticket.setUpdatedAt(LocalDateTime.now());

        SupportTicket savedTicket = ticketRepository.save(ticket);

        // Notify the Customer
        UserAuth customerUser = userAuthRepository.findByEmail(
                ticket.getCustomer().getEmail()
        ).orElse(null);

        if (customerUser != null) {
            notificationService.createNotification(
                    customerUser.getId(),
                    "Support Ticket Updated",
                    "Your support ticket status is now " + status.name(),
                    "SUPPORT_STATUS",
                    ticket.getId()
            );
        }

        return toResponse(savedTicket);
    }
    // Customer or Manager sends a support message
    @Transactional
    public SupportMessageResponse sendMessage(
            Long ticketId,
            SendSupportMessageRequest request,
            String username) {

        UserAuth user = getUser(username);
        requireSupportAccess(user);

        SupportTicket ticket = getTicket(ticketId);

        // Customers can message only on their own tickets
        if (user.getRole() == Role.CUSTOMER) {
            Customer customer = getCustomer(user);

            if (!ticket.getCustomer().getId().equals(customer.getId())) {
                throw new AccessDeniedException(
                        "You cannot access another customer's ticket");
            }
        }

        SupportMessage message = SupportMessage.builder()
                .supportTicket(ticket)
                .sender(user)
                .message(request.getMessage())
                .build();

        ticket.setUpdatedAt(LocalDateTime.now());
        ticketRepository.save(ticket);

        SupportMessage savedMessage = messageRepository.save(message);

        if (user.getRole() == Role.CUSTOMER) {

            // Customer message → notify Managers
            List<UserAuth> managers =
                    userAuthRepository.findByRole(Role.MANAGER);

            for (UserAuth manager : managers) {
                notificationService.createNotification(
                        manager.getId(),
                        "New Support Message",
                        "A customer sent a message on ticket: "
                                + ticket.getSubject(),
                        "SUPPORT_MESSAGE",
                        ticket.getId()
                );
            }

        } else {

            // Manager reply → notify Customer
            UserAuth customerUser = userAuthRepository.findByEmail(
                    ticket.getCustomer().getEmail()
            ).orElse(null);

            if (customerUser != null) {
                notificationService.createNotification(
                        customerUser.getId(),
                        "Support Reply Received",
                        "The Manager replied to your ticket: "
                                + ticket.getSubject(),
                        "SUPPORT_MESSAGE",
                        ticket.getId()
                );
            }
        }

        return toMessageResponse(savedMessage);
    }
    // Customer or Manager views messages for a ticket
    @Transactional(readOnly = true)
    public List<SupportMessageResponse> getMessages(
            Long ticketId,
            String username) {

        UserAuth user = getUser(username);

        requireSupportAccess(user);

        SupportTicket ticket = getTicket(ticketId);

        // Customers can view only their own ticket conversations
        if (user.getRole() == Role.CUSTOMER) {
            Customer customer = getCustomer(user);

            if (!ticket.getCustomer().getId().equals(customer.getId())) {
                throw new AccessDeniedException(
                        "You cannot access another customer's ticket");
            }
        }

        return messageRepository
                .findBySupportTicketIdOrderByCreatedAtAsc(ticketId)
                .stream()
                .map(this::toMessageResponse)
                .toList();
    }

    private UserAuth getUser(String username) {
        return userAuthRepository.findByUsername(username)
                .orElseThrow(() -> new AccessDeniedException(
                        "User account not found"));
    }

    private Customer getCustomer(UserAuth user) {
        return customerRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Customer profile not found"));
    }

    private SupportTicket getTicket(Long ticketId) {
        return ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Support ticket not found"));
    }

    private void requireCustomer(UserAuth user) {
        if (user.getRole() != Role.CUSTOMER) {
            throw new AccessDeniedException(
                    "Customer access required");
        }
    }

    private void requireManager(UserAuth user) {
        if (user.getRole() != Role.MANAGER) {
            throw new AccessDeniedException(
                    "Manager access required");
        }
    }

    private void requireSupportAccess(UserAuth user) {
        if (user.getRole() != Role.CUSTOMER
                && user.getRole() != Role.MANAGER) {
            throw new AccessDeniedException(
                    "Support access required");
        }
    }

    private SupportTicketResponse toResponse(SupportTicket ticket) {
        return new SupportTicketResponse(
                ticket.getId(),
                ticket.getSubject(),
                ticket.getDescription(),
                ticket.getCustomer().getId(),
                ticket.getCustomer().getName(),
                ticket.getStatus(),
                ticket.getCreatedAt(),
                ticket.getUpdatedAt()
        );
    }

    private SupportMessageResponse toMessageResponse(
            SupportMessage message) {

        return new SupportMessageResponse(
                message.getId(),
                message.getSupportTicket().getId(),
                message.getSender().getId(),
                message.getSender().getUsername(),
                message.getSender().getRole(),
                message.getMessage(),
                message.getCreatedAt()
        );
    }
}
