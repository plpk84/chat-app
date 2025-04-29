package com.chupachups.messenger.config.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "storage")
public class MinioProperties {
    private String endpoint;
    private String username;
    private String password;
    private String region;
    private String bucket;
}
