package com.chupachups.messenger.service;

import com.chupachups.messenger.dto.jwt.JwtDto;
import com.chupachups.messenger.dto.user.UserLoginDto;
import com.chupachups.messenger.dto.user.UserRegistrationDto;
import com.chupachups.messenger.dto.user.UserStatusDto;
import com.chupachups.messenger.exception.RefreshTokenException;
import com.chupachups.messenger.mapper.UserMapper;
import com.chupachups.messenger.model.Status;
import com.chupachups.messenger.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final SimpMessagingTemplate messagingTemplate;
    private final MinioService minioService;

    public JwtDto register(UserRegistrationDto register, MultipartFile avatar) {
        var user = userMapper.toEntity(register);
        user.setPassword(passwordEncoder.encode(register.getPassword()));
        if (avatar != null && !avatar.isEmpty()) {
            user.setAvatarUrl(minioService.saveToStorage(avatar));
        }
        user = userRepository.save(user);
        authenticate(register.getUsername(), register.getPassword());
        var accessToken = jwtService.generateAccessToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        jwtService.saveUserToken(refreshToken, user);
        var userDto = userMapper.toDto(user);
        messagingTemplate.convertAndSend("/topic/public", userMapper.toStatusDto(userDto));
        return new JwtDto(
                accessToken,
                refreshToken,
                userDto
        );

    }

    public JwtDto login(UserLoginDto login) {
        authenticate(login.username(), login.password());
        var user = userRepository.findByUsername(login.username()).orElseThrow(
                () -> new RuntimeException("User not found")
        );
        jwtService.deleteAllUserToken(user);
        var accessToken = jwtService.generateAccessToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        jwtService.saveUserToken(refreshToken, user);
        user.setStatus(Status.ONLINE);
        userRepository.save(user);
        var userDto = userMapper.toDto(user);
        messagingTemplate.convertAndSend("/topic/public", userMapper.toStatusDto(userDto));
        return new JwtDto(
                accessToken,
                refreshToken,
                userDto
        );
    }

    public JwtDto delete(String principal) {
        var user = userRepository.findByUsername(principal).orElseThrow(
                () -> new RuntimeException("User not found")
        );
        jwtService.deleteAllUserToken(user);
        user.setEnabled(false);
        user.setStatus(Status.OFFLINE);
        userRepository.save(user);
        SecurityContextHolder.clearContext();
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        jwtService.saveUserToken(refreshToken, user);
        var userDto = userMapper.toDto(user);
        messagingTemplate.convertAndSend("/topic/public", userMapper.toStatusDto(userDto));
        return new JwtDto(
                accessToken,
                refreshToken,
                userDto
        );
    }

    public void recover(String token) {
        String email = jwtService.extractUsername(token);
        var user = userRepository.findByUsername(email).orElseThrow(
                () -> new RuntimeException("User not found")
        );
        if (!jwtService.isTokenValid(token, user)) {
            throw new RuntimeException("Token isn't valid");
        }
        user.setEnabled(true);
        userRepository.save(user);
        jwtService.deleteAllUserToken(user);
    }

    public void logout(String principal) {
        var user = userRepository.findByUsername(principal).orElseThrow(
                () -> new RuntimeException("User not found")
        );
        jwtService.deleteAllUserToken(user);
        user.setStatus(Status.OFFLINE);
        SecurityContextHolder.clearContext();
        userRepository.save(user);
        messagingTemplate.convertAndSend("/topic/public", new UserStatusDto(principal, Status.OFFLINE));
    }

    public JwtDto refreshToken(String token) {
        String username = jwtService.extractUsername(token);
        var user = userRepository.findByUsername(username).orElseThrow(
                () -> new RefreshTokenException("User not found")
        );
        jwtService.deleteAllUserToken(user);
        var accessToken = jwtService.generateAccessToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        jwtService.saveUserToken(refreshToken, user);
        return new JwtDto(
                accessToken,
                refreshToken,
                userMapper.toDto(user)
        );
    }

    private void authenticate(String username, String password) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        username,
                        password
                )
        );
    }
}
