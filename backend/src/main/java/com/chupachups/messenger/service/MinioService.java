package com.chupachups.messenger.service;

import com.chupachups.messenger.config.properties.MinioProperties;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.http.Method;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class MinioService {

    private final MinioClient minioClient;
    private final MinioProperties minioProperties;

    @SneakyThrows
    public String saveToStorage(MultipartFile file, String bucketName) {

        byte[] fileBytes = file.getBytes();
        try (ByteArrayInputStream inputStream = new ByteArrayInputStream(fileBytes)) {
            String fileName = UUID.randomUUID() + "-" + file.getOriginalFilename();
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(fileName)
                            .stream(inputStream, fileBytes.length, -1)
                            .contentType(file.getContentType())
                            .build()
            );
            log.info(">> Файл {} загружен в Minio", fileName);

            return minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Method.GET)
                            .bucket(bucketName)
                            .object(fileName)
                            .build()
            );
        } catch (Exception e) {
            log.error(">> Ошибка при загрузке файла {}", e.getMessage());
            throw e;
        }
    }
}