package com.chupachups.messenger.controller;

import com.chupachups.messenger.dto.jwt.JwtDto;
import com.chupachups.messenger.dto.user.UserLoginDto;
import com.chupachups.messenger.dto.user.UserRegistrationDto;
import com.chupachups.messenger.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<JwtDto> register(@RequestBody UserRegistrationDto register) {
        return ResponseEntity.ok(authService.register(register));
    }

    @PostMapping("/login")
    public ResponseEntity<JwtDto> login(@RequestBody UserLoginDto login) {
        return ResponseEntity.ok(authService.login(login));
    }

    @PostMapping("/logout")
    public void logout(Principal principal) {
        authService.logout(principal.getName());
    }

    @PostMapping("/token-refresh")
    public ResponseEntity<JwtDto> refresh(Principal principal) {
        return ResponseEntity.ok(authService.refreshToken(principal.getName()));
    }

    @DeleteMapping("/user-delete")
    public ResponseEntity<JwtDto> delete(Principal principal) {
        return ResponseEntity.ok(authService.delete(principal.getName()));
    }

    @PutMapping("/user-recover")
    public void recover(@RequestParam(value = "recover") String token) {
        authService.recover(token);
    }

}
