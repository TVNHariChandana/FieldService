package com.codewithme.fieldservice.service;

import com.codewithme.fieldservice.dto.NotificationResponse;
import com.codewithme.fieldservice.model.Notification;
import com.codewithme.fieldservice.model.UserAuth;
import com.codewithme.fieldservice.repository.NotificationRepository;
import com.codewithme.fieldservice.repository.UserAuthRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserAuthRepository userAuthRepository;

    public NotificationService(
            NotificationRepository notificationRepository,
            UserAuthRepository userAuthRepository) {
        this.notificationRepository = notificationRepository;
        this.userAuthRepository = userAuthRepository;
    }

    public void createNotification(
            Long recipientId,
            String title,
            String message,
            String type,
            Long relatedEntityId) {

        UserAuth recipient = userAuthRepository.findById(recipientId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setRelatedEntityId(relatedEntityId);
        notification.setCreatedAt(LocalDateTime.now());
        notification.setRead(false);

        notificationRepository.save(notification);
    }

    public List<NotificationResponse> getMyNotifications(String username) {
        UserAuth user = getUser(username);

        return notificationRepository
                .findByRecipientIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(notification -> new NotificationResponse(
                        notification.getId(),
                        notification.getTitle(),
                        notification.getMessage(),
                        notification.getType(),
                        notification.getRelatedEntityId(),
                        notification.isRead(),
                        notification.getCreatedAt()
                ))
                .toList();
    }
    public long getUnreadCount(String username) {
        UserAuth user = getUser(username);

        return notificationRepository
                .countByRecipientIdAndIsReadFalse(user.getId());
    }

    @Transactional
    public void markAsRead(Long notificationId, String username) {
        UserAuth user = getUser(username);

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getRecipient().getId().equals(user.getId())) {
            throw new RuntimeException("You cannot access this notification");
        }

        notification.setRead(true);
    }

    @Transactional
    public void markAllAsRead(String username) {
        UserAuth user = getUser(username);

        List<Notification> notifications = notificationRepository
                .findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(user.getId());

        notifications.forEach(notification -> notification.setRead(true));
    }

    private UserAuth getUser(String username) {
        return userAuthRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}