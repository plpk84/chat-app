package com.chupachups.messenger.controller;

import com.chupachups.messenger.dto.jwt.JwtOutDto;
import com.chupachups.messenger.dto.user.UserLoginDto;
import com.chupachups.messenger.dto.user.UserOutDto;
import com.chupachups.messenger.dto.user.UserRegistrationDto;
import com.chupachups.messenger.exception.RefreshTokenException;
import com.chupachups.messenger.service.AuthService;
import com.chupachups.messenger.service.JwtService;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
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
    private final JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<JwtOutDto> register(@RequestBody UserRegistrationDto register, HttpServletResponse response) {
        var result = authService.register(register);
        setRefreshTokenCookie(response, result.refreshToken());
        return ResponseEntity.ok(new JwtOutDto(result.accessToken(), result.user()));
    }

    @PostMapping("/login")
    public ResponseEntity<JwtOutDto> login(@RequestBody UserLoginDto login, HttpServletResponse response) {
        var result = authService.login(login);
        setRefreshTokenCookie(response, result.refreshToken());
        return ResponseEntity.ok(new JwtOutDto(result.accessToken(), result.user()));
    }

    @PostMapping("/logout")
    public void logout(Principal principal, HttpServletResponse response) {
        authService.logout(principal.getName());
        deleteRefreshTokenCookie(response);
    }

    @GetMapping("/refresh-token")
    public ResponseEntity<JwtOutDto> refresh(@CookieValue(name = "refreshToken", required = false) String refreshToken, HttpServletResponse response) {
        if (refreshToken == null) {
            throw new RefreshTokenException("Нет cookie refreshToken");
        }
        try {
            var result = authService.refreshToken(refreshToken);
            setRefreshTokenCookie(response, result.refreshToken());
            return ResponseEntity.ok(new JwtOutDto(result.accessToken(), result.user()));
        } catch (JwtException e) {
            deleteRefreshTokenCookie(response);
            throw new RefreshTokenException(e.getMessage());
        }

    }

    @DeleteMapping("/user-delete")
    public ResponseEntity<UserOutDto> delete(Principal principal, HttpServletResponse response) {
        var result = authService.delete(principal.getName());
        setRefreshTokenCookie(response, result.refreshToken());
        return ResponseEntity.ok(result.user());
    }

    @PutMapping("/user-recover")
    public void recover(@CookieValue(value = "refreshToken", required = false) String token) {
        if (token == null) {
            throw new IllegalArgumentException("Нет cookie refreshToken");
        }
        authService.recover(token);
    }

    private void setRefreshTokenCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie("refreshToken", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setAttribute("SameSite", "Lax");
        cookie.setMaxAge(jwtService.getRefreshTokenExpiration().intValue() / 1000);
        response.addCookie(cookie);
    }

    private void deleteRefreshTokenCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie("refreshToken", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setAttribute("SameSite", "Lax");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }
}
