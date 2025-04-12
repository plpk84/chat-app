package com.chupachups.messenger.service;


import com.chupachups.messenger.dto.user.UserOutDto;
import com.chupachups.messenger.mapper.UserMapper;
import com.chupachups.messenger.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repository;
    private final UserMapper mapper;

    public List<UserOutDto> getUsers(int offset, int size) {
        return mapper.toDtoList(repository.findAllByEnabledIsTrue(PageRequest.of(offset, size)).toList());
    }

    public UserOutDto getUserInfo(String name) {
        return mapper.toDto(repository.findByUsername(name).orElse(null));
    }
}
