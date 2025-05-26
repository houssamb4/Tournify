package com.Football.Tournament.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class JwtAuthenticationFilterTest {

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private CustomUserDetailsService customUserDetailsService;

    @InjectMocks
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    private MockHttpServletRequest request;
    private MockHttpServletResponse response;
    private MockFilterChain filterChain;

    @BeforeEach
    void setUp() {
        request = new MockHttpServletRequest();
        response = new MockHttpServletResponse();
        filterChain = new MockFilterChain();
        SecurityContextHolder.clearContext();
    }

    @Test
    void doFilterInternal_NoToken_DoesNotSetAuthentication() throws Exception {
        // Act
        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        // Assert
        verify(tokenProvider, never()).validateToken(anyString());
        verify(tokenProvider, never()).getUserIdFromJWT(anyString());
        verify(customUserDetailsService, never()).loadUserById(anyLong());
    }

    @Test
    void doFilterInternal_InvalidAuthorizationHeader_DoesNotSetAuthentication() throws Exception {
        // Arrange
        request.addHeader("Authorization", "Invalid");

        // Act
        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        // Assert
        verify(tokenProvider, never()).validateToken(anyString());
        verify(tokenProvider, never()).getUserIdFromJWT(anyString());
        verify(customUserDetailsService, never()).loadUserById(anyLong());
    }

    @Test
    void doFilterInternal_InvalidToken_DoesNotSetAuthentication() throws Exception {
        // Arrange
        request.addHeader("Authorization", "Bearer invalid-token");
        when(tokenProvider.validateToken("invalid-token")).thenReturn(false);

        // Act
        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        // Assert
        verify(tokenProvider).validateToken("invalid-token");
        verify(tokenProvider, never()).getUserIdFromJWT(anyString());
        verify(customUserDetailsService, never()).loadUserById(anyLong());
    }

    @Test
    void doFilterInternal_ExceptionInProcessing_ClearsContext() throws Exception {
        // Arrange
        request.addHeader("Authorization", "Bearer valid-token");
        when(tokenProvider.validateToken("valid-token")).thenReturn(true);
        when(tokenProvider.getUserIdFromJWT("valid-token")).thenThrow(new RuntimeException("Test exception"));

        // Act
        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        // Assert
        verify(tokenProvider).validateToken("valid-token");
        verify(tokenProvider).getUserIdFromJWT("valid-token");
        verify(customUserDetailsService, never()).loadUserById(anyLong());
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void doFilterInternal_ValidToken_SetsAuthentication() throws Exception {
        // Arrange
        request.addHeader("Authorization", "Bearer valid-token");
        when(tokenProvider.validateToken("valid-token")).thenReturn(true);
        when(tokenProvider.getUserIdFromJWT("valid-token")).thenReturn(1L);
        
        UserPrincipal userPrincipal = mock(UserPrincipal.class);
        when(customUserDetailsService.loadUserById(1L)).thenReturn(userPrincipal);

        // Act
        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        // Assert
        verify(tokenProvider).validateToken("valid-token");
        verify(tokenProvider).getUserIdFromJWT("valid-token");
        verify(customUserDetailsService).loadUserById(1L);
        assertNotNull(SecurityContextHolder.getContext().getAuthentication());
    }
} 