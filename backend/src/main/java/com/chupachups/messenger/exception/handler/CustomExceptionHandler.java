package com.chupachups.messenger.exception.handler;

import com.chupachups.messenger.exception.RefreshTokenException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class CustomExceptionHandler {
    @ExceptionHandler(value = IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }

    @ExceptionHandler(value = RefreshTokenException.class)
    public ResponseEntity<String> handleIllegalArgumentException(RefreshTokenException e) {
        return ResponseEntity.status(401).body(e.getMessage());
    }
}
