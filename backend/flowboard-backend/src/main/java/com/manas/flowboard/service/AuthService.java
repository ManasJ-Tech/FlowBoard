package com.manas.flowboard.service;

import com.manas.flowboard.dto.AuthResponse;
import com.manas.flowboard.dto.LoginRequest;
import com.manas.flowboard.dto.RegisterRequest;
import com.manas.flowboard.entity.Role;
import com.manas.flowboard.entity.User;
import com.manas.flowboard.repository.UserRepository;
import com.manas.flowboard.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;


    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }



    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());

        // Encrypt password before saving
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        // Determine the role from the request
        String requestedRole = request.getRole();
        if (requestedRole == null || requestedRole.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role is required");
        }

        if (requestedRole.equalsIgnoreCase("PROJECT_MANAGER")) {
            user.setRole(Role.PROJECT_MANAGER);

            String managerCode = request.getManagerCode();
            if (managerCode == null || managerCode.isBlank()) {
                managerCode = generateUniqueManagerCode();
            } else if (userRepository.findByManagerCode(managerCode).isPresent()) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Manager code already exists");
            }

            user.setManagerCode(managerCode);
            userRepository.save(user);

            String token = jwtService.generateToken(user.getEmail());
            return new AuthResponse(token, "Project manager registered successfully", managerCode);
        }

        if (requestedRole.equalsIgnoreCase("TEAM")) {
            user.setRole(Role.TEAM);

            String managerCode = request.getManagerCode();
            if (managerCode == null || managerCode.isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Manager code is required for team signup");
            }

            User manager = userRepository.findByManagerCode(managerCode)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid manager code"));

            user.setManager(manager);
            userRepository.save(user);

            String token = jwtService.generateToken(user.getEmail());
            return new AuthResponse(token, "Team member registered successfully");
        }

        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role selected");
    }

    private String generateUniqueManagerCode() {
        String code;
        do {
            code = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (userRepository.findByManagerCode(code).isPresent());
        return code;
    }



    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPassword());
        if (!passwordMatches) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(token, "Login successful");
    }

    public void forgotPassword(String email) {
        // Always return a generic response to avoid account enumeration.
        userRepository.findByEmail(email).ifPresent(user -> {
            // In a real app: generate a token, persist it, and send email with reset link.
            String token = UUID.randomUUID().toString();
            System.out.println("Password reset requested for " + email + ", token=" + token);
        });
    }
}
