package com.chupachups.messenger.config;

import com.chupachups.messenger.config.properties.MinioProperties;
import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class MinioConfig {
    private final MinioProperties properties;

    @Bean
    @SneakyThrows(Exception.class)
    public MinioClient minioClient() {
        var minioClient = MinioClient.builder()
                .endpoint(properties.getEndpoint())
                .credentials(properties.getUsername(), properties.getPassword())
                .region(properties.getRegion())
                .build();
        if (!minioClient.bucketExists(BucketExistsArgs.builder()
                .bucket(properties.getAvatarBucket())
                .build())
        ) {
            minioClient.makeBucket(MakeBucketArgs.builder()
                    .bucket(properties.getAvatarBucket())
                    .build()
            );
        }
        if (!minioClient.bucketExists(BucketExistsArgs.builder()
                .bucket(properties.getFileBucket())
                .build())
        ) {
            minioClient.makeBucket(MakeBucketArgs.builder()
                    .bucket(properties.getFileBucket())
                    .build()
            );
        }
        return minioClient;
    }
}