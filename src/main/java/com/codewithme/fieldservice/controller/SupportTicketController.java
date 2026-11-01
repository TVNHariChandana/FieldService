package com.codewithme.fieldservice.controller;

import com.codewithme.fieldservice.dto.CreateSupportTicketRequest;
import com.codewithme.fieldservice.dto.SupportTicketResponse;
import com.codewithme.fieldservice.model.SupportTicketStatus;
import com.codewithme.fieldservice.service.SupportTicketService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/support/tickets")
public class SupportTicketController {

    private final SupportTicketService supportTicketService;

    public SupportTicketController(
            SupportTicketService supportTicketService) {
        this.supportTicketService = supportTicketService;
    }

    // Customer: Create a support ticket
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SupportTicketResponse createTicket(
            @Valid @RequestBody CreateSupportTicketRequest request,
            Authentication authentication) {

        return supportTicketService.createTicket(
                request, authentication.getName());
    }

    // Customer: View their own tickets
    @GetMapping("/my-tickets")
    public List<SupportTicketResponse> getMyTickets(
            Authentication authentication) {

        return supportTicketService.getMyTickets(
                authentication.getName());
    }

    // Manager: View all support tickets
    @GetMapping
    public List<SupportTicketResponse> getAllTickets(
            Authentication authentication) {

        return supportTicketService.getAllTickets(
                authentication.getName());
    }

    // Manager: Update ticket status
    @PutMapping("/{ticketId}/status")
    public SupportTicketResponse updateStatus(
            @PathVariable Long ticketId,
            @RequestParam SupportTicketStatus status,
            Authentication authentication) {

        return supportTicketService.updateStatus(
                ticketId, status, authentication.getName());
    }
}