package com.manas.flowboard.config;

import com.manas.flowboard.entity.Role;
import com.manas.flowboard.entity.User;
import com.manas.flowboard.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DevDataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DevDataLoader(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Create a default project manager
        String managerEmail = "devmanager@example.com";
        if (userRepository.findByEmail(managerEmail).isEmpty()) {
            User manager = new User();
            manager.setFullName("Dev Manager");
            manager.setEmail(managerEmail);
            manager.setPassword(passwordEncoder.encode("Password123!"));
            manager.setRole(Role.PROJECT_MANAGER);
            manager.setManagerCode("DEV-MGR-001");
            userRepository.save(manager);
        }

        // Create a default team member
        String memberEmail = "devmember@example.com";
        if (userRepository.findByEmail(memberEmail).isEmpty()) {
            User manager = userRepository.findByEmail(managerEmail).orElse(null);
            User member = new User();
            member.setFullName("Dev Member");
            member.setEmail(memberEmail);
            member.setPassword(passwordEncoder.encode("Password123!"));
            member.setRole(Role.TEAM);
            member.setManager(manager);
            userRepository.save(member);
        }
    }
}
