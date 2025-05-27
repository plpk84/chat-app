package com.chupachups.messenger.dto.user;

import com.chupachups.messenger.model.Status;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;

import java.util.List;

@Builder
public record UserOutDto(
        String username,
        @JsonProperty(value = "first_name")
        String firstName,
        @JsonProperty(value = "last_name")
        String lastName,
        Status status,
        @JsonProperty(value = "avatar_url")
        String avatarUrl,
        List<String> contacts
) {
}
