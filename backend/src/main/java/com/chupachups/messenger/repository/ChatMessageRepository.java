package com.chupachups.messenger.repository;

import com.chupachups.messenger.model.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {
    Page<ChatMessage> findByChatId(String chatId, PageRequest pageRequest);
}
