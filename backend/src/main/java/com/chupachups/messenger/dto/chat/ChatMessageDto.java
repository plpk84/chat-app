package com.chupachups.messenger.dto.chat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessageDto {
    private String id;
    private String senderId;
    private String recipientId;
    private String content;
    private Boolean isFile;
    private String fileName;
    private String fileType;
    private String timestamp;
}
