package com.Football.Tournament.security;

import com.Football.Tournament.entities.User;
import com.Football.Tournament.dao.UserDao;
import com.Football.Tournament.exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Collections;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class CustomUserDetailsServiceTest {

    @Mock
    private UserDao userDao;

    @InjectMocks
    private CustomUserDetailsService userDetailsService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPassword("password123");
        testUser.setRole("ROLE_USER");
    }

    @Test
    void loadUserByUsername_Success() {
        // Arrange
        when(userDao.findByUsernameOrEmail(anyString()))
            .thenReturn(Optional.of(testUser));

        // Act
        UserDetails userDetails = userDetailsService.loadUserByUsername("testuser");

        // Assert
        assertNotNull(userDetails);
        assertEquals("testuser", userDetails.getUsername());
        assertTrue(userDetails instanceof UserPrincipal);
        assertTrue(userDetails.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_USER")));
    }

    @Test
    void loadUserByUsername_UserNotFound_ThrowsException() {
        // Arrange
        when(userDao.findByUsernameOrEmail(anyString()))
            .thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(UsernameNotFoundException.class, () -> 
            userDetailsService.loadUserByUsername("nonexistent"));
    }

    @Test
    void loadUserById_Success() {
        // Arrange
        when(userDao.findById(anyLong())).thenReturn(Optional.of(testUser));

        // Act
        UserDetails userDetails = userDetailsService.loadUserById(1L);

        // Assert
        assertNotNull(userDetails);
        assertEquals("testuser", userDetails.getUsername());
        assertTrue(userDetails instanceof UserPrincipal);
        assertTrue(userDetails.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_USER")));
    }

    @Test
    void loadUserById_UserNotFound_ThrowsException() {
        // Arrange
        when(userDao.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(UsernameNotFoundException.class, () -> 
            userDetailsService.loadUserById(999L));
    }

    @Test
    void createUserPrincipal_Success() {
        // Act
        UserPrincipal userPrincipal = UserPrincipal.create(testUser);

        // Assert
        assertNotNull(userPrincipal);
        assertEquals(testUser.getId(), userPrincipal.getId());
        assertEquals(testUser.getUsername(), userPrincipal.getUsername());
        assertEquals(testUser.getEmail(), userPrincipal.getEmail());
        assertEquals(testUser.getPassword(), userPrincipal.getPassword());
        assertTrue(userPrincipal.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_USER")));
    }
} 