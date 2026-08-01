package com.manas.flowboard.controller;

import com.manas.flowboard.entity.Role;
import com.manas.flowboard.entity.User;
import com.manas.flowboard.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;


@RestController
@RequestMapping("/api/users")
public class UserController {


    private final UserRepository userRepository;


    public UserController(UserRepository userRepository) {

        this.userRepository = userRepository;

    }



    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {

        return ResponseEntity.ok(
                userRepository.findAll()
        );

    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/team")
    public ResponseEntity<List<User>> getTeamMembers(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(401).build();
        }

        User currentUser = userRepository.findByEmail(authentication.getName())
                .orElse(null);

        if (currentUser == null || currentUser.getRole() != Role.PROJECT_MANAGER) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        return ResponseEntity.ok(
                userRepository.findAllByManager(currentUser)
        );
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(401).build();
        }

        return userRepository.findByEmail(authentication.getName())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

}