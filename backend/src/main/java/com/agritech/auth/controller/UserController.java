package com.agritech.auth.controller;

import com.agritech.auth.dto.AuthResponse;
import com.agritech.auth.model.User;
import com.agritech.auth.repository.UserRepository;
import com.agritech.auth.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody User loginReq) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginReq.getEmail(), loginReq.getPassword())
        );
        
        User user = userRepository.findByEmail(loginReq.getEmail()).orElseThrow();
        String token = jwtUtils.generateToken(user);
        return new AuthResponse(token, user);
    }

    @PostMapping("/register")
    public AuthResponse register(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("FARMER");
        }
        
        User savedUser = userRepository.save(user);
        String token = jwtUtils.generateToken(savedUser);
        return new AuthResponse(token, savedUser);
    }
}
