package com.chupachups.messenger.dto.jwt;

import com.chupachups.messenger.dto.user.UserOutDto;
import com.fasterxml.jackson.annotation.JsonProperty;

public record JwtDto(
        @JsonProperty("access_token")
        String accessToken,
        @JsonProperty("refresh_token")
        String refreshToken,
        UserOutDto user
) {
}