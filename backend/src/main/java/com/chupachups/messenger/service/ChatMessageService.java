package com.chupachups.messenger.service;

import com.chupachups.messenger.dto.chat.ChatMessageDto;
import com.chupachups.messenger.mapper.ChatMessageMapper;
import com.chupachups.messenger.model.ChatMessage;
import com.chupachups.messenger.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatMessageService {
    private final ChatMessageRepository repository;
    private final ChatRoomService chatRoomService;
    private final ChatMessageMapper mapper;

    public ChatMessageDto save(ChatMessage chatMessage) {
        var chatId = chatRoomService
                .getChatRoomId(chatMessage.getSenderId(), chatMessage.getRecipientId(), true)
                .orElseThrow();
        chatMessage.setChatId(chatId);
        return mapper.toDto(repository.save(chatMessage));
    }

    public List<ChatMessageDto> findChatMessages(String senderId, String principal, String recipientId, int offset, int size) {
        if (!principal.equals(senderId)) {
            throw new IllegalArgumentException("Нет доступа");
        }
        var chatId = chatRoomService.getChatRoomId(senderId, recipientId, false);
        var chatMessages = chatId
                .map(id ->
                        repository.findByChatId(id, PageRequest.of(
                                        offset,
                                        size,
                                        Sort.by(Sort.Direction.DESC, "timestamp")
                                )
                        ).toList()
                ).orElse(Collections.emptyList());
        return mapper.toDtoList(chatMessages);
    }

    public void deleteChat(String senderId, String principal, String recipientId) {
        if (!principal.equals(senderId)) {
            throw new IllegalArgumentException("Нет доступа");
        }
        var chatId = chatRoomService.getChatRoomId(senderId, recipientId, false).orElseThrow();
        repository.deleteAllByChatId(chatId);
        chatRoomService.deleteChatRoom(chatId);
    }
}
