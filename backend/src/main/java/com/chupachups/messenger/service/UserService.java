package com.chupachups.messenger.service;


import com.chupachups.messenger.config.properties.MinioProperties;
import com.chupachups.messenger.dto.user.UserOutDto;
import com.chupachups.messenger.mapper.UserMapper;
import com.chupachups.messenger.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repository;
    private final UserMapper mapper;
    private final MinioService minioService;
    private final MinioProperties minioProperties;

    public List<UserOutDto> getUsers(int offset, int size) {
        return mapper.toDtoList(repository.findAllByEnabledIsTrue(PageRequest.of(offset, size)).toList());
    }

    public void addContact(String username, String principal, String contact) {
        if (!username.equals(principal)) {
            throw new IllegalArgumentException("Нет доступа");
        }
        var user = repository.findByUsername(username).orElseThrow();
        var addedUser = repository.findByUsername(contact).orElseThrow();
        user.getContacts().add(contact);
        addedUser.getContacts().add(username);
        repository.save(user);
        repository.save(addedUser);
    }

    public void removeContact(String username, String principal, String contact) {
        if (!username.equals(principal)) {
            throw new IllegalArgumentException("Нет доступа");
        }
        var user = repository.findByUsername(username).orElseThrow();
        var addedUser = repository.findByUsername(contact).orElseThrow();
        user.getContacts().remove(contact);
        addedUser.getContacts().remove(username);
        repository.save(user);
        repository.save(addedUser);
    }

    public List<UserOutDto> getContacts(String username, String principal, int offset, int size) {
        if (!username.equals(principal)) {
            throw new IllegalArgumentException("Нет доступа");
        }
        var user = repository.findByUsername(username).orElseThrow();
        return mapper.toDtoList(repository.findByUsernameIn(user.getContacts(), (PageRequest.of(offset, size))).toList());
    }

    public void changeAvatar(String name, MultipartFile avatar) {
        var user = repository.findByUsername(name).orElseThrow();
        var newUrl = minioService.saveToStorage(avatar, minioProperties.getAvatarBucket());
        user.setAvatarUrl(newUrl);
        repository.save(user);
    }

}
