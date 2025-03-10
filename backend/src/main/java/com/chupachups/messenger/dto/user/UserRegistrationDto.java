package com.chupachups.messenger.dto.user;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class UserRegistrationDto {
    @JsonProperty(required = true)
    private String username;
    @JsonProperty(required = true)
    private String password;
    @JsonProperty(value = "first_name", required = true)
    private String firstName;
    @JsonProperty(value = "last_name", required = true)
    private String lastName;
}
