package com.chupachups.messenger.controller;

import com.chupachups.messenger.config.properties.MinioProperties;
import com.chupachups.messenger.dto.file.FileUploadDto;
import com.chupachups.messenger.service.MinioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
public class FileController {
    private final MinioService minioService;
    private final MinioProperties minioProperties;

    @PostMapping()
    public ResponseEntity<FileUploadDto> uploadFile(@RequestParam("file") MultipartFile file) {
        String fileUrl = minioService.saveToStorage(file, minioProperties.getFileBucket());
        return ResponseEntity.ok(new FileUploadDto(fileUrl, file.getOriginalFilename()));
    }
}
