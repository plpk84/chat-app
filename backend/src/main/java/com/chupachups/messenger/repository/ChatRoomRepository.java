package com.chupachups.messenger.repository;

import com.chupachups.messenger.model.ChatRoom;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ChatRoomRepository extends MongoRepository<ChatRoom, String> {
    Optional<ChatRoom> findByChatId(String chatId);

    void deleteByChatId(String chatId);
}
