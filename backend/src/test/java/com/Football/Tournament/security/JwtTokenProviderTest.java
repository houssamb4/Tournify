package com.Football.Tournament.security;

import io.jsonwebtoken.ExpiredJwtException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.test.util.ReflectionTestUtils;

import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class JwtTokenProviderTest {

    @InjectMocks
    private JwtTokenProvider tokenProvider;

    @Mock
    private Authentication authentication;

    @Mock
    private UserPrincipal userPrincipal;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(tokenProvider, "jwtSecret", "testSecretKey123456789testSecretKey123456789");
        ReflectionTestUtils.setField(tokenProvider, "jwtExpirationInMs", 3600000);
    }

    @Test
    void generateToken_Success() {
        // Arrange
        when(authentication.getPrincipal()).thenReturn(userPrincipal);
        when(userPrincipal.getId()).thenReturn(1L);
        when(userPrincipal.getUsername()).thenReturn("testuser");

        // Act
        String token = tokenProvider.generateToken(authentication);

        // Assert
        assertNotNull(token);
        assertTrue(token.length() > 0);
        assertTrue(tokenProvider.validateToken(token));
    }

    @Test
    void getUserIdFromJWT_Success() {
        // Arrange
        when(authentication.getPrincipal()).thenReturn(userPrincipal);
        when(userPrincipal.getId()).thenReturn(1L);
        when(userPrincipal.getUsername()).thenReturn("testuser");
        String token = tokenProvider.generateToken(authentication);

        // Act
        Long userId = tokenProvider.getUserIdFromJWT(token);

        // Assert
        assertEquals(1L, userId);
    }

    @Test
    void validateToken_InvalidToken_ReturnsFalse() {
        // Act & Assert
        assertFalse(tokenProvider.validateToken("invalid.token.here"));
    }

    @Test
    void validateToken_ExpiredToken_ReturnsFalse() {
        // Arrange
        when(authentication.getPrincipal()).thenReturn(userPrincipal);
        when(userPrincipal.getId()).thenReturn(1L);
        when(userPrincipal.getUsername()).thenReturn("testuser");
        
        ReflectionTestUtils.setField(tokenProvider, "jwtExpirationInMs", -3600000); // Set expiration to past
        String token = tokenProvider.generateToken(authentication);

        // Act & Assert
        assertFalse(tokenProvider.validateToken(token));
    }

    @Test
    void validateToken_NullToken_ReturnsFalse() {
        // Act & Assert
        assertFalse(tokenProvider.validateToken(null));
    }
} 