
package com.codewithme.fieldservice.controller;

import com.codewithme.fieldservice.dto.ChatConversationResponse;
import com.codewithme.fieldservice.dto.ChatMessageResponse;
import com.codewithme.fieldservice.model.ChatConversation;
import com.codewithme.fieldservice.model.CreateConversationRequest;
import com.codewithme.fieldservice.model.SendMessageRequest;
import com.codewithme.fieldservice.service.ChatConversationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatConversationController {

    private final ChatConversationService chatService;

    public ChatConversationController(ChatConversationService chatService) {
        this.chatService = chatService;
    }
    @PostMapping("/conversations")
    @ResponseStatus(HttpStatus.CREATED)
    public ChatConversationResponse createConversation(
            @Valid @RequestBody CreateConversationRequest request,
            Authentication authentication) {

        return chatService.createConversation(
                request.getWorkOrderId(),
                request.getSubject(),
                authentication.getName()
        );
    }

    @GetMapping("/conversations")
    public List<ChatConversationResponse> getAllConversations(
            Authentication authentication) {

        return chatService.getAllConversations(
                authentication.getName()
        );
    }

    @GetMapping("/conversations/{id}")
    public ChatConversationResponse getConversation(
            @PathVariable Long id,
            Authentication authentication) {

        return chatService.getConversation(
                id,
                authentication.getName()
        );
    }


    @PostMapping("/conversations/{id}/messages")
    @ResponseStatus(HttpStatus.CREATED)
    public ChatMessageResponse sendMessage(
            @PathVariable Long id,
            @Valid @RequestBody SendMessageRequest request,
            Authentication authentication) {

        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication.getPrincipal().equals("anonymousUser")) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Please log in to send a message"
            );
        }

        String senderUsername = authentication.getName();

        return chatService.sendMessage(
                id,
                request.getMessage(),
                senderUsername
        );
    }

    @GetMapping("/conversations/{id}/messages")
    public List<ChatMessageResponse> getMessages(@PathVariable Long id,Authentication authentication) {
        return chatService.getMessages(id,authentication.getName());
    }
}
