package com.chupachups.messenger.mapper;

import com.chupachups.messenger.dto.user.UserOutDto;
import com.chupachups.messenger.dto.user.UserRegistrationDto;
import com.chupachups.messenger.dto.user.UserStatusDto;
import com.chupachups.messenger.model.User;
import org.mapstruct.Mapper;

import java.util.List;

import static org.mapstruct.InjectionStrategy.CONSTRUCTOR;
import static org.mapstruct.MappingConstants.ComponentModel.SPRING;

@Mapper(componentModel = SPRING, injectionStrategy = CONSTRUCTOR)
public interface UserMapper {
    User toEntity(UserRegistrationDto userRegistrationDto);
    UserOutDto toDto(User user);

    UserStatusDto toStatusDto(UserOutDto dto);

    List<UserOutDto> toDtoList(List<User> userList);

    List<User> toEntityList(List<UserRegistrationDto> userRegistrationDtoList);
}
