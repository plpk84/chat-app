package com.chupachups.messenger.dto.file;

import com.fasterxml.jackson.annotation.JsonProperty;

public record FileUploadDto(
        String url,
        @JsonProperty(value = "file_name")
        String fileName
) {
}
