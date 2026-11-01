package com.codewithme.fieldservice.controller;

import com.codewithme.fieldservice.dto.NotificationResponse;
import com.codewithme.fieldservice.service.NotificationService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public List<NotificationResponse> getMyNotifications(
            Authentication authentication) {
        return notificationService.getMyNotifications(authentication.getName());
    }

    @GetMapping("/unread-count")
    public Map<String, Long> getUnreadCount(Authentication authentication) {
        return Map.of(
                "unreadCount",
                notificationService.getUnreadCount(authentication.getName())
        );
    }

    @PutMapping("/{id}/read")
    public Map<String, String> markAsRead(
            @PathVariable Long id,
            Authentication authentication) {

        notificationService.markAsRead(id, authentication.getName());

        return Map.of("message", "Notification marked as read");
    }

    @PutMapping("/mark-all-read")
    public Map<String, String> markAllAsRead(Authentication authentication) {
        notificationService.markAllAsRead(authentication.getName());

        return Map.of("message", "All notifications marked as read");
    }
}