package com.chupachups.messenger.dto.user;

import com.chupachups.messenger.model.Status;

public record UserStatusDto(
        String username,
        Status status
) {
}
