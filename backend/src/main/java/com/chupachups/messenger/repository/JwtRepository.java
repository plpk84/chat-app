package com.chupachups.messenger.repository;

import com.chupachups.messenger.model.Jwt;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface JwtRepository extends MongoRepository<Jwt, String> {
    List<Jwt> findByUsername(String username);
}
