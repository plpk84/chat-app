package com.chupachups.messenger.controller;

import com.chupachups.messenger.dto.user.UserOutDto;
import com.chupachups.messenger.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    @GetMapping()
    public ResponseEntity<List<UserOutDto>> getUsers(@RequestParam int offset, @RequestParam int size) {
        return ResponseEntity.ok(userService.getUsers(offset,size));
    }
}
