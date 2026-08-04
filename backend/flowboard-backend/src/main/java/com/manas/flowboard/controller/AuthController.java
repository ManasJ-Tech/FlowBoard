package com.manas.flowboard.controller;


import com.manas.flowboard.dto.AuthResponse;
import com.manas.flowboard.dto.LoginRequest;
import com.manas.flowboard.dto.RegisterRequest;
import com.manas.flowboard.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @RequestBody RegisterRequest request
    ){
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody LoginRequest request
    ){
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<AuthResponse> forgotPassword(
            @RequestBody com.manas.flowboard.dto.ForgotPasswordRequest request
    ){
        authService.forgotPassword(request.getEmail());
        return ResponseEntity.ok(new AuthResponse(null, "If an account exists, a password reset link has been sent to the email."));
    }
}
