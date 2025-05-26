package com.Football.Tournament.controller;

import com.Football.Tournament.dto.LoginRequest;
import com.Football.Tournament.dto.SignUpRequest;
import com.Football.Tournament.entities.User;
import com.Football.Tournament.security.JwtTokenProvider;
import com.Football.Tournament.security.UserPrincipal;
import com.Football.Tournament.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class AuthControllerTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserService userService;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private Authentication authentication;

    @Mock
    private SecurityContext securityContext;

    @InjectMocks
    private AuthController authController;

    private LoginRequest loginRequest;
    private SignUpRequest signUpRequest;
    private User testUser;
    private UserPrincipal userPrincipal;

    @BeforeEach
    void setUp() {
        // Setup login request
        loginRequest = new LoginRequest();
        loginRequest.setUsernameOrEmail("testuser");
        loginRequest.setPassword("password123");

        // Setup signup request
        signUpRequest = new SignUpRequest();
        signUpRequest.setUsername("testuser");
        signUpRequest.setEmail("test@example.com");
        signUpRequest.setPassword("password123");
        signUpRequest.setFirstName("Test");
        signUpRequest.setLastName("User");

        // Setup test user
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPassword("encodedPassword");
        testUser.setRole("ROLE_USER");
        testUser.setCreatedAt(LocalDateTime.now());
        testUser.setUpdatedAt(LocalDateTime.now());

        // Setup UserPrincipal
        userPrincipal = UserPrincipal.create(testUser);

        // Setup Security Context
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void authenticateUser_Success() {
        // Arrange
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(tokenProvider.generateToken(authentication)).thenReturn("test.jwt.token");
        when(userService.findByUsernameOrEmail(loginRequest.getUsernameOrEmail()))
                .thenReturn(Optional.of(testUser));
        when(userService.updateUser(testUser)).thenReturn(testUser);

        // Act
        ResponseEntity<?> response = authController.authenticateUser(loginRequest);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(tokenProvider).generateToken(authentication);
        verify(userService).findByUsernameOrEmail(loginRequest.getUsernameOrEmail());
        verify(userService).updateUser(testUser);
    }

    @Test
    void registerUser_Success() {
        // Arrange
        when(userService.existsByEmail(signUpRequest.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(signUpRequest.getPassword())).thenReturn("encodedPassword");
        when(userService.createUser(any(User.class))).thenReturn(testUser);

        // Act
        ResponseEntity<?> response = authController.registerUser(signUpRequest);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
    }

    @Test
    void registerUser_EmailTaken() {
        // Arrange
        when(userService.existsByEmail(signUpRequest.getEmail())).thenReturn(true);

        // Act
        ResponseEntity<?> response = authController.registerUser(signUpRequest);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void getCurrentUser_Success() {
        // Arrange
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userPrincipal);
        when(userService.getUserById(userPrincipal.getId())).thenReturn(Optional.of(testUser));
        when(authentication.isAuthenticated()).thenReturn(true);

        // Act
        ResponseEntity<?> response = authController.getCurrentUser();

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void getCurrentUser_Unauthorized() {
        // Arrange
        when(securityContext.getAuthentication()).thenReturn(null);

        // Act
        ResponseEntity<?> response = authController.getCurrentUser();

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }
} 