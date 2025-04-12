package com.chupachups.messenger.dto.jwt;

import com.chupachups.messenger.dto.user.UserOutDto;
import com.fasterxml.jackson.annotation.JsonProperty;

public record JwtOutDto(
        @JsonProperty("access_token")
        String accessToken,
        UserOutDto user
) {
}