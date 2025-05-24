package com.Football.Tournament.security;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Collections;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.context.ActiveProfiles;

import com.Football.Tournament.entities.User;

/**
 * Test class for JWT token provider
 * Tests token generation and validation for user authentication
 */
@SpringBootTest
@ActiveProfiles("test")
public class JwtTokenProviderTest {

    @Autowired
    private JwtTokenProvider tokenProvider;
    
    @Mock
    private CustomUserDetailsService userDetailsService;
    
    private UserPrincipal userPrincipal;
    private User testUser;
    
    @BeforeEach
    public void setup() {
        // Setup test user
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setRole("ROLE_USER");
        
        // Setup UserPrincipal based on test user
        userPrincipal = UserPrincipal.create(testUser);
        
        // Configure mock behavior
        when(userDetailsService.loadUserById(1L)).thenReturn(userPrincipal);
    }
    
    @Test
    public void testGenerateToken() {
        // Create authentication object
        Authentication authentication = new UsernamePasswordAuthenticationToken(
            userPrincipal,
            null,
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
        );
        
        // Generate token
        String token = tokenProvider.generateToken(authentication);
        
        // Verify token is not null or empty
        assertNotNull(token, "Token should not be null");
        assertFalse(token.isEmpty(), "Token should not be empty");
    }
    
    @Test
    public void testGetUserIdFromJWT() {
        // Create authentication object and generate token
        Authentication authentication = new UsernamePasswordAuthenticationToken(
            userPrincipal,
            null,
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
        );
        
        String token = tokenProvider.generateToken(authentication);
        
        // Get user ID from token
        Long userId = tokenProvider.getUserIdFromJWT(token);
        
        // Verify user ID matches
        assertEquals(testUser.getId(), userId, "User ID from token should match test user ID");
    }
    
    @Test
    public void testValidateToken() {
        // Create authentication object and generate token
        Authentication authentication = new UsernamePasswordAuthenticationToken(
            userPrincipal,
            null,
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
        );
        
        String token = tokenProvider.generateToken(authentication);
        
        // Validate token
        boolean isValid = tokenProvider.validateToken(token);
        
        // Verify token is valid
        assertTrue(isValid, "Token should be valid");
    }
}
