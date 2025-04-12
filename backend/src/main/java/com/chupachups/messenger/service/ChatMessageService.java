package com.chupachups.messenger.service;

import com.chupachups.messenger.model.ChatMessage;
import com.chupachups.messenger.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatMessageService {
    private final ChatMessageRepository repository;
    private final ChatRoomService chatRoomService;

    public ChatMessage save(ChatMessage chatMessage) {
        var chatId = chatRoomService
                .getChatRoomId(chatMessage.getSenderId(), chatMessage.getRecipientId(), true)
                .orElseThrow();
        chatMessage.setChatId(chatId);
        repository.save(chatMessage);
        return chatMessage;
    }

    public List<ChatMessage> findChatMessages(String senderId, String recipientId, int offset, int size) {
        var chatId = chatRoomService.getChatRoomId(senderId, recipientId, false);
        return chatId.map(id -> repository.findByChatId(id, PageRequest.of(offset, size, Sort.by(Sort.Direction.DESC, "timestamp"))).toList()).orElse(new ArrayList<>());
    }
}
