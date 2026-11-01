package com.codewithme.fieldservice.controller;

import com.codewithme.fieldservice.dto.SendSupportMessageRequest;
import com.codewithme.fieldservice.dto.SupportMessageResponse;
import com.codewithme.fieldservice.service.SupportTicketService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/support/tickets/{ticketId}/messages")
public class SupportMessageController {

    private final SupportTicketService supportTicketService;

    public SupportMessageController(
            SupportTicketService supportTicketService) {
        this.supportTicketService = supportTicketService;
    }

    // Customer or Manager sends a message
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SupportMessageResponse sendMessage(
            @PathVariable Long ticketId,
            @Valid @RequestBody SendSupportMessageRequest request,
            Authentication authentication) {

        return supportTicketService.sendMessage(
                ticketId, request, authentication.getName());
    }

    // Customer or Manager views ticket messages
    @GetMapping
    public List<SupportMessageResponse> getMessages(
            @PathVariable Long ticketId,
            Authentication authentication) {

        return supportTicketService.getMessages(
                ticketId, authentication.getName());
    }
}