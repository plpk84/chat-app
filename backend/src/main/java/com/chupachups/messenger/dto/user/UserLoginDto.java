package com.chupachups.messenger.dto.user;

import com.fasterxml.jackson.annotation.JsonProperty;

public record UserLoginDto(
        @JsonProperty(required = true)
        String username,
        @JsonProperty(required = true)
        String password
) {
}

