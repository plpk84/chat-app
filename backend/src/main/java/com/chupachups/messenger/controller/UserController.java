package com.chupachups.messenger.controller;

import com.chupachups.messenger.dto.user.UserOutDto;
import com.chupachups.messenger.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    @PostMapping("/avatar")
    public ResponseEntity<String> changeAvatar(Principal principal,
                                               @RequestPart(value = "avatar", required = false) MultipartFile avatar) {
        userService.changeAvatar(principal.getName(), avatar);
        return ResponseEntity.ok("Avatar changed");
    }

    @GetMapping()
    public ResponseEntity<List<UserOutDto>> getUsers(@RequestParam int offset, @RequestParam int size) {
        return ResponseEntity.ok(userService.getUsers(offset, size));
    }

    @GetMapping("/{username}/contacts")
    public ResponseEntity<List<UserOutDto>> getContacts(@PathVariable String username,
                                                        Principal principal,
                                                        @RequestParam int offset,
                                                        @RequestParam int size) {
        return ResponseEntity.ok(userService.getContacts(username, principal.getName(), offset, size));
    }

    @PostMapping("/{username}/contacts/{contact}")
    public ResponseEntity<String> addContact(@PathVariable String username,
                                             @PathVariable String contact,
                                             Principal principal) {
        userService.addContact(username, principal.getName(), contact);
        return ResponseEntity.ok("Contact added");
    }

    @DeleteMapping("/{username}/contacts/{contact}")
    public ResponseEntity<String> removeContact(@PathVariable String username,
                                                @PathVariable String contact,
                                                Principal principal) {
        userService.removeContact(username, principal.getName(), contact);
        return ResponseEntity.ok("Contact removed");
    }
}
