package com.chupachups.messenger.service;

import com.chupachups.messenger.dto.chat.ChatMessageDto;
import com.chupachups.messenger.mapper.ChatMessageMapper;
import com.chupachups.messenger.model.ChatMessage;
import com.chupachups.messenger.repository.ChatMessageRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChatMessageServiceTest {

    @Mock
    private ChatMessageRepository repository;

    @Mock
    private ChatRoomService chatRoomService;

    @Mock
    private ChatMessageMapper mapper;

    @InjectMocks
    private ChatMessageService chatMessageService;

    private final String SENDER_ID = "sender1";
    private final String RECIPIENT_ID = "recipient1";
    private final String PRINCIPAL_ID = "sender1";
    private final String CHAT_ID = "chat1";
    private ChatMessage chatMessage;
    private ChatMessageDto chatMessageDto;

    @BeforeEach
    void setUp() {
        chatMessage = new ChatMessage();
        chatMessage.setSenderId(SENDER_ID);
        chatMessage.setRecipientId(RECIPIENT_ID);
        chatMessage.setContent("Test message");

        chatMessageDto = new ChatMessageDto();
        chatMessageDto.setSenderId(SENDER_ID);
        chatMessageDto.setRecipientId(RECIPIENT_ID);
        chatMessageDto.setContent("Test message");
    }

    @Test
    void save_ShouldSaveMessage_WhenChatRoomExists() {
        // given
        when(chatRoomService.getChatRoomId(SENDER_ID, RECIPIENT_ID, true))
                .thenReturn(Optional.of(CHAT_ID));
        when(repository.save(any(ChatMessage.class))).thenReturn(chatMessage);
        when(mapper.toDto(chatMessage)).thenReturn(chatMessageDto);

        // when
        ChatMessageDto result = chatMessageService.save(chatMessage);

        // then
        assertNotNull(result);
        assertEquals(SENDER_ID, result.getSenderId());
        assertEquals(RECIPIENT_ID, result.getRecipientId());
        verify(repository).save(chatMessage);
        verify(chatRoomService).getChatRoomId(SENDER_ID, RECIPIENT_ID, true);
    }

    @Test
    void save_ShouldThrowException_WhenChatRoomNotCreated() {
        // given
        when(chatRoomService.getChatRoomId(SENDER_ID, RECIPIENT_ID, true))
                .thenReturn(Optional.empty());

        // when && then
        assertThrows(RuntimeException.class, () -> chatMessageService.save(chatMessage));
        verify(chatRoomService).getChatRoomId(SENDER_ID, RECIPIENT_ID, true);
        verifyNoInteractions(repository);
    }

    @Test
    void findChatMessages_ShouldReturnMessages_WhenAccessGrantedAndChatExists() {
        // given
        int offset = 0;
        int size = 10;
        PageRequest pageable = PageRequest.of(offset, size, Sort.by(Sort.Direction.DESC, "timestamp"));
        List<ChatMessage> messages = List.of(chatMessage);

        when(chatRoomService.getChatRoomId(SENDER_ID, RECIPIENT_ID, false))
                .thenReturn(Optional.of(CHAT_ID));
        when(repository.findByChatId(CHAT_ID, pageable)).thenReturn(new PageImpl<>(messages));
        when(mapper.toDtoList(messages)).thenReturn(List.of(chatMessageDto));

        // when
        List<ChatMessageDto> result = chatMessageService.findChatMessages(SENDER_ID, PRINCIPAL_ID, RECIPIENT_ID, offset, size);

        // then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(chatRoomService).getChatRoomId(SENDER_ID, RECIPIENT_ID, false);
        verify(repository).findByChatId(CHAT_ID, pageable);
    }

    @Test
    void findChatMessages_ShouldThrowException_WhenAccessDenied() {
        // given
        String unauthorizedPrincipal = "unauthorizedUser";

        // when && then
        assertThrows(IllegalArgumentException.class, () ->
                chatMessageService.findChatMessages(SENDER_ID, unauthorizedPrincipal, RECIPIENT_ID, 0, 10)
        );
        verifyNoInteractions(chatRoomService, repository);
    }

    @Test
    void findChatMessages_ShouldReturnEmptyList_WhenChatNotExists() {
        // given
        when(chatRoomService.getChatRoomId(SENDER_ID, RECIPIENT_ID, false))
                .thenReturn(Optional.empty());

        // when
        List<ChatMessageDto> result = chatMessageService.findChatMessages(SENDER_ID, PRINCIPAL_ID, RECIPIENT_ID, 0, 10);

        // then
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(chatRoomService).getChatRoomId(SENDER_ID, RECIPIENT_ID, false);
        verifyNoInteractions(repository);
    }

    @Test
    void deleteChat_ShouldDeleteChat_WhenAccessGrantedAndChatExists() {
        // given
        when(chatRoomService.getChatRoomId(SENDER_ID, RECIPIENT_ID, false))
                .thenReturn(Optional.of(CHAT_ID));
        doNothing().when(repository).deleteAllByChatId(CHAT_ID);
        doNothing().when(chatRoomService).deleteChatRoom(CHAT_ID);

        // when
        chatMessageService.deleteChat(SENDER_ID, PRINCIPAL_ID, RECIPIENT_ID);

        // then
        verify(chatRoomService).getChatRoomId(SENDER_ID, RECIPIENT_ID, false);
        verify(repository).deleteAllByChatId(CHAT_ID);
        verify(chatRoomService).deleteChatRoom(CHAT_ID);
    }

    @Test
    void deleteChat_ShouldThrowException_WhenAccessDenied() {
        // given
        String unauthorizedPrincipal = "unauthorizedUser";

        // when && then
        assertThrows(IllegalArgumentException.class, () ->
                chatMessageService.deleteChat(SENDER_ID, unauthorizedPrincipal, RECIPIENT_ID)
        );
        verifyNoInteractions(chatRoomService, repository);
    }

    @Test
    void deleteChat_ShouldThrowException_WhenChatNotExists() {
        // given
        when(chatRoomService.getChatRoomId(SENDER_ID, RECIPIENT_ID, false))
                .thenReturn(Optional.empty());

        // when && then
        assertThrows(RuntimeException.class, () ->
                chatMessageService.deleteChat(SENDER_ID, PRINCIPAL_ID, RECIPIENT_ID)
        );
        verify(chatRoomService).getChatRoomId(SENDER_ID, RECIPIENT_ID, false);
        verifyNoInteractions(repository);
    }
}