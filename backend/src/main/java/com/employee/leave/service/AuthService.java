package com.employee.leave.service;

import com.employee.leave.dto.LoginRequest;
import com.employee.leave.dto.LoginResponse;
import com.employee.leave.entity.User;
import com.employee.leave.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository repo;

    public AuthService(UserRepository repo) {
        this.repo = repo;
    }

    public LoginResponse login(LoginRequest request) {

        User user = repo.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return new LoginResponse(
                user.getUsername(),
                user.getRole(),
                "Login successful"
        );
    }
}
