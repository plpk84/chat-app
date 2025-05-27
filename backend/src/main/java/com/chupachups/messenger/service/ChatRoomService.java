package com.chupachups.messenger.service;

import com.chupachups.messenger.model.ChatRoom;
import com.chupachups.messenger.repository.ChatRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;

    public Optional<String> getChatRoomId(
            String senderId,
            String recipientId,
            boolean createNewRoomIfNotExists
    ) {
        return chatRoomRepository.findByChatId(String.format("%s_%s", senderId, recipientId))
                .or(() -> chatRoomRepository.findByChatId(String.format("%s_%s", recipientId, senderId)))
                .map(ChatRoom::getChatId)
                .or(() -> {
                    if (createNewRoomIfNotExists) {
                        var chatId = String.format("%s_%s", senderId, recipientId);
                        var chatRoom = ChatRoom.builder()
                                .chatId(chatId)
                                .build();
                        chatRoomRepository.save(chatRoom);
                        return Optional.of(chatId);
                    }
                    return Optional.empty();
                });
    }

    public void deleteChatRoom(String chatId) {
        chatRoomRepository.deleteByChatId(chatId);
    }
}
