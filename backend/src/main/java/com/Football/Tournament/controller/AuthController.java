package com.Football.Tournament.controller;

import com.Football.Tournament.dto.ApiResponse;
import com.Football.Tournament.dto.JwtAuthResponse;
import com.Football.Tournament.dto.UserDto;
import com.Football.Tournament.dto.LoginRequest;
import com.Football.Tournament.dto.SignUpRequest;
import com.Football.Tournament.entities.User;
import com.Football.Tournament.entities.UserStats;
import com.Football.Tournament.security.JwtTokenProvider;
import com.Football.Tournament.security.UserPrincipal;
import com.Football.Tournament.services.UserService;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashSet;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtTokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<JwtAuthResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        logger.info("=== LOGIN REQUEST STARTED ===");
        logger.debug("Attempting authentication for usernameOrEmail: {}", loginRequest.getUsernameOrEmail());
        logger.trace("Login request details - UsernameOrEmail: {}, Password length: {}", 
            loginRequest.getUsernameOrEmail(), 
            loginRequest.getPassword() != null ? loginRequest.getPassword().length() : 0);

        try {
            logger.debug("Attempting to authenticate with raw password: {}", loginRequest.getPassword());
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsernameOrEmail(),
                    loginRequest.getPassword()
                )
            );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        logger.debug("Authentication successful for user: {}", loginRequest.getUsernameOrEmail());
        logger.trace("Authentication details: {}", authentication);

            // Update last login time
            userService.findByUsernameOrEmail(loginRequest.getUsernameOrEmail())
                .ifPresentOrElse(
                    user -> {
                        logger.debug("Updating last login time for user ID: {}", user.getId());
                        user.setLastLogin(LocalDateTime.now());
                        userService.updateUser(user);
                        logger.trace("User details after update: {}", user);
                    },
                    () -> logger.error("User not found in database after successful authentication: {}", loginRequest.getUsernameOrEmail())
                );

            String jwt = tokenProvider.generateToken(authentication);
            logger.debug("JWT token generated successfully");
            logger.trace("JWT token details: {}", jwt);

            logger.info("=== LOGIN SUCCESSFUL ===");
            return ResponseEntity.ok(new JwtAuthResponse(jwt));

        } catch (BadCredentialsException e) {
            logger.warn("Invalid credentials for email: {}", loginRequest.getUsernameOrEmail());
            logger.debug("BadCredentialsException stack trace:", e);
            throw e;
        } catch (AuthenticationException e) {
            logger.error("Authentication failed for email: {}", loginRequest.getUsernameOrEmail(), e);
            throw e;
        } catch (Exception e) {
            logger.error("Unexpected error during login for email: {}", loginRequest.getUsernameOrEmail(), e);
            throw new RuntimeException("Login process failed", e);
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        logger.info("=== SIGNUP REQUEST STARTED ===");
        logger.debug("New registration attempt - Email: {}, Name: {} {}",
            signUpRequest.getEmail(),
            signUpRequest.getFirstName(),
            signUpRequest.getLastName());

        try {
            logger.debug("Checking email availability for: {}", signUpRequest.getEmail());
            if (userService.existsByEmail(signUpRequest.getEmail())) {
                logger.warn("Email already registered: {}", signUpRequest.getEmail());
                return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Email is already taken!"));
            }

            logger.debug("Creating new user object");
            User user = new User();
            user.setUsername(signUpRequest.getUsername());
            user.setFirstName(signUpRequest.getFirstName());
            user.setLastName(signUpRequest.getLastName());
            user.setEmail(signUpRequest.getEmail());
            user.setPhone(signUpRequest.getPhone());
            user.setAddress(signUpRequest.getAddress());
            
            String rawPassword = signUpRequest.getPassword();
            String encodedPassword = passwordEncoder.encode(rawPassword);
            logger.debug("[DEBUG] Signup raw password: {}", rawPassword);
            logger.debug("[DEBUG] Signup encoded password: {}", encodedPassword);
            user.setPassword(encodedPassword);
            logger.debug("Password encoding complete");
            logger.trace("Raw password length: {}, Encoded password: {}", rawPassword.length(), encodedPassword);
            
            user.setRole("ROLE_USER");
            
            user.setAvatar("https://api.dicebear.com/7.x/avataaars/svg?seed=" + signUpRequest.getFirstName());
            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());
            user.setStatus("active");
            user.setLastLogin(LocalDateTime.now());
            user.setGamesPlayed(0);
            user.setGamesWon(0);
            user.setGamesLost(0);
            user.setWinPercentage("0%");
            user.setNotifications(true);
            user.setMarketingEmails(false);

            logger.debug("Saving user to database");
            User savedUser = userService.createUser(user);
            logger.info("User successfully registered with ID: {}", savedUser.getId());
            logger.trace("Saved user details: {}", savedUser);

            logger.info("=== SIGNUP COMPLETED SUCCESSFULLY ===");
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse(true, "User registered successfully"));
                
        } catch (Exception e) {
            logger.error("Signup process failed for email: {}", signUpRequest.getEmail(), e);
            logger.debug("Error details: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, "Registration failed: " + e.getMessage()));
        }
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<UserDto> getCurrentUser() {
        logger.info("=== CURRENT USER REQUEST ===");
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        logger.debug("Security context authentication: {}", authentication);
        
        if (authentication == null || !authentication.isAuthenticated()) {
            logger.warn("Unauthenticated access attempt to /me endpoint");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        logger.debug("User principal extracted - ID: {}, Name: {}", 
            principal.getId(), principal.getName());

        return userService.getUserById(principal.getId())
            .map(user -> {
                logger.debug("Found user in database: {}", user.getEmail());
                
                UserDto userDto = new UserDto();
                userDto.setId(user.getId());
                userDto.setUsername(user.getUsername());
                userDto.setEmail(user.getEmail());
                userDto.setFirstName(user.getFirstName());
                userDto.setLastName(user.getLastName());
                userDto.setPhone(user.getPhone());
                userDto.setAddress(user.getAddress());
                userDto.setRole(user.getRole());
                
                logger.trace("Constructed UserDTO: {}", userDto);
                logger.info("=== CURRENT USER REQUEST COMPLETE ===");
                return ResponseEntity.ok(userDto);
            })
            .orElseGet(() -> {
                logger.error("User not found in database for principal ID: {}", principal.getId());
                return ResponseEntity.notFound().build();
            });
    }

    @PutMapping("/update-profile")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse> updateProfile(@Valid @RequestBody UserDto userDto) {
        logger.info("=== UPDATE PROFILE REQUEST STARTED ===");
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        logger.debug("User principal extracted - ID: {}, Name: {}", 
            principal.getId(), principal.getName());
        
        try {
            return userService.getUserById(principal.getId())
                .map(user -> {
                    logger.debug("Found user in database: {}", user.getEmail());
                    
                    // Only update fields that are provided and not null
                    if (userDto.getFirstName() != null) {
                        user.setFirstName(userDto.getFirstName());
                    }
                    if (userDto.getLastName() != null) {
                        user.setLastName(userDto.getLastName());
                    }
                    if (userDto.getPhone() != null) {
                        user.setPhone(userDto.getPhone());
                    }
                    if (userDto.getAddress() != null) {
                        user.setAddress(userDto.getAddress());
                    }
                    // Email and username typically require additional validation if changing
                    
                    user.setUpdatedAt(LocalDateTime.now());
                    
                    User updatedUser = userService.updateUser(user);
                    logger.info("User profile updated successfully - ID: {}", updatedUser.getId());
                    logger.trace("Updated user details: {}", updatedUser);
                    
                    logger.info("=== UPDATE PROFILE COMPLETED SUCCESSFULLY ===");
                    return ResponseEntity.ok(new ApiResponse(true, "Profile updated successfully"));
                })
                .orElseGet(() -> {
                    logger.error("User not found in database for principal ID: {}", principal.getId());
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse(false, "User not found"));
                });
        } catch (Exception e) {
            logger.error("Profile update failed for user ID: {}", principal.getId(), e);
            logger.debug("Error details: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, "Profile update failed: " + e.getMessage()));
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logoutUser() {
        logger.info("=== LOGOUT REQUEST STARTED ===");
        
        // Since JWT is stateless, the server does not maintain session information
        // To implement logout, the client should discard the token
        // On the server side, we can log the event and provide success response
        
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated()) {
                UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
                logger.debug("Logout request for user ID: {}", principal.getId());
                
                // Clear the security context
                SecurityContextHolder.clearContext();
                logger.debug("Security context cleared");
            }
            
            logger.info("=== LOGOUT COMPLETED SUCCESSFULLY ===");
            return ResponseEntity.ok(new ApiResponse(true, "User logged out successfully"));
        } catch (Exception e) {
            logger.error("Logout process failed", e);
            logger.debug("Error details: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, "Logout failed: " + e.getMessage()));
        }
    }
}