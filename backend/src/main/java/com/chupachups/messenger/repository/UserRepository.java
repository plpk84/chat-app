package com.chupachups.messenger.repository;

import com.chupachups.messenger.model.Status;
import com.chupachups.messenger.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository  extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);
    Page<User> findAllByEnabledIsTrue(PageRequest pageRequest);
}
