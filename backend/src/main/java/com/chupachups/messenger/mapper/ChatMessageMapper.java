package com.chupachups.messenger.mapper;

import com.chupachups.messenger.dto.chat.ChatMessageDto;
import com.chupachups.messenger.model.ChatMessage;
import org.mapstruct.Mapper;

import static org.mapstruct.InjectionStrategy.CONSTRUCTOR;
import static org.mapstruct.MappingConstants.ComponentModel.SPRING;

@Mapper(componentModel = SPRING, injectionStrategy = CONSTRUCTOR)
public interface ChatMessageMapper {
    ChatMessageDto toDto(ChatMessage entity);
}
