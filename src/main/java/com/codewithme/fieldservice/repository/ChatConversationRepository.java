
package com.codewithme.fieldservice.repository;

import com.codewithme.fieldservice.model.ChatConversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatConversationRepository
        extends JpaRepository<ChatConversation, Long> {
}
