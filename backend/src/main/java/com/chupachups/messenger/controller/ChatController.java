package com.chupachups.messenger.controller;

import com.chupachups.messenger.mapper.ChatMessageMapper;
import com.chupachups.messenger.model.ChatMessage;
import com.chupachups.messenger.service.ChatMessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageService chatMessageService;
    private final ChatMessageMapper mapper;

    @MessageMapping("/chat")
    public void processMessage(@Payload ChatMessage chatMessage) {
        ChatMessage savedMsg = chatMessageService.save(chatMessage);
        messagingTemplate.convertAndSend(
                "/queue/" + chatMessage.getRecipientId() + ".messages",
                mapper.toDto(savedMsg)
        );
    }

    @GetMapping("/api/v1/messages/{senderId}/{recipientId}")
    public ResponseEntity<List<ChatMessage>> findChatMessages(@PathVariable String senderId,
                                                              @PathVariable String recipientId,
                                                              @RequestParam int offset,
                                                              @RequestParam int size) {
        return ResponseEntity
                .ok(chatMessageService.findChatMessages(senderId, recipientId, offset, size));
    }
}
