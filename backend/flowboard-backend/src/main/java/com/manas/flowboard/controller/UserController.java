package com.manas.flowboard.controller;

import com.manas.flowboard.dto.CurrentUserResponse;
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
    public ResponseEntity<CurrentUserResponse> getCurrentUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(401).build();
        }

        return userRepository.findByEmail(authentication.getName())
                .map(user -> {
                    String managerName = null;
                    if (user.getManager() != null) {
                        managerName = user.getManager().getFullName();
                    }
                    CurrentUserResponse response = new CurrentUserResponse(
                            user.getId(),
                            user.getFullName(),
                            user.getEmail(),
                            user.getRole() != null ? user.getRole().name() : null,
                            user.getManagerCode(),
                            managerName,
                            user.getCreatedAt()
                    );
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

}