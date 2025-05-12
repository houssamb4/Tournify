package com.UserManagement.Controller;

import com.UserManagement.Dto.UserDto;
import com.UserManagement.Entity.User;
import com.UserManagement.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class RestAuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserDto userDto) {
        // Check if username already exists
        if (userService.findByUsername(userDto.getUsername()) != null) {
            return ResponseEntity.badRequest().body("Username is already taken!");
        }

        // Check if email already exists
        if (userService.findByEmail(userDto.getEmail()) != null) {
            return ResponseEntity.badRequest().body("Email is already registered!");
        }

        // Validate password length
        if (userDto.getPassword().length() < 6) {
            return ResponseEntity.badRequest().body("Password must be at least 6 characters long!");
        }

        // Save the user
        userService.saveUser(userDto);
        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody UserDto userDto) {
        User user = userService.findByUsername(userDto.getUsername());
        
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found!");
        }

        if (!passwordEncoder.matches(userDto.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Invalid password!");
        }

        return ResponseEntity.ok("Login successful!");
    }
} 