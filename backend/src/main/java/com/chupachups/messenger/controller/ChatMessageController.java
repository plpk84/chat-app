package com.chupachups.messenger.controller;

import com.chupachups.messenger.dto.chat.ChatMessageDto;
import com.chupachups.messenger.model.ChatMessage;
import com.chupachups.messenger.service.ChatMessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.security.Principal;
import java.util.List;

@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatMessageController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageService chatMessageService;

    @MessageMapping("/chat")
    public void processMessage(@Payload ChatMessage chatMessage) {
        var msg = chatMessageService.save(chatMessage);
        messagingTemplate.convertAndSend(
                "/queue/" + chatMessage.getRecipientId() + ".messages",
                msg
        );
    }

    @GetMapping("/api/v1/messages/{senderId}/{recipientId}")
    public ResponseEntity<List<ChatMessageDto>> findChatMessages(@PathVariable String senderId,
                                                                 @PathVariable String recipientId,
                                                                 Principal principal,
                                                                 @RequestParam int offset,
                                                                 @RequestParam int size) {
        return ResponseEntity
                .ok(chatMessageService.findChatMessages(senderId, principal.getName(), recipientId, offset, size));
    }

    @DeleteMapping("/api/v1/messages/{senderId}/{recipientId}")
    public ResponseEntity<String> deleteChatMessages(@PathVariable String senderId,
                                                     @PathVariable String recipientId,
                                                     Principal principal) {
        chatMessageService.deleteChat(senderId, principal.getName(), recipientId);
        return ResponseEntity
                .ok("Chat deleted");
    }
}
