package com.Football.Tournament.services;

import com.Football.Tournament.config.BaseTest;
import com.Football.Tournament.config.TestConfig;
import com.Football.Tournament.dao.UserDao;
import com.Football.Tournament.entities.User;
import com.Football.Tournament.entities.PasswordResetToken;
import com.Football.Tournament.repository.PasswordResetTokenRepository;
import com.Football.Tournament.utils.TestDataUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

public class UserServiceTest extends BaseTest {

    @Mock
    private UserDao userDao;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Mock
    private EmailService emailService;

    @MockBean
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private UserServiceImpl userService;

    private User testUser;
    private PasswordResetToken testToken;

    @BeforeEach
    void setUp() {
        testUser = TestDataUtil.createTestUser();
        
        testToken = new PasswordResetToken();
        testToken.setId(1L);
        testToken.setEmail(testUser.getEmail());
        testToken.setVerificationCode("123456");
        testToken.setUsed(false);
        testToken.setExpiryDate(LocalDateTime.now().plusMinutes(15)); // Set expiry date 15 minutes in the future
    }

    @Test
    void createUser_Success() {
        when(userDao.save(any(User.class))).thenReturn(testUser);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");

        User createdUser = userService.createUser(testUser);

        assertNotNull(createdUser);
        assertEquals(testUser.getUsername(), createdUser.getUsername());
    }

    @Test
    void updateUser_Success() {
        when(userDao.save(any(User.class))).thenReturn(testUser);

        User updatedUser = userService.updateUser(testUser);

        assertNotNull(updatedUser);
        assertEquals(testUser.getUsername(), updatedUser.getUsername());
        verify(userDao).save(any(User.class));
    }

    @Test
    void getUserById_Success() {
        when(userDao.findById(anyLong())).thenReturn(Optional.of(testUser));

        Optional<User> foundUser = userService.getUserById(1L);

        assertTrue(foundUser.isPresent());
        assertEquals(testUser.getId(), foundUser.get().getId());
    }

    @Test
    void findByUsername_Success() {
        when(userDao.findByUsername(anyString())).thenReturn(Optional.of(testUser));

        Optional<User> foundUser = userService.findByUsername("testuser");

        assertTrue(foundUser.isPresent());
        assertEquals(testUser.getUsername(), foundUser.get().getUsername());
    }

    @Test
    void findByEmail_Success() {
        when(userDao.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));

        Optional<User> foundUser = userService.findByEmail(testUser.getEmail());

        assertTrue(foundUser.isPresent());
        assertEquals(testUser.getEmail(), foundUser.get().getEmail());
    }

    @Test
    void findByEmail_NotFound() {
        when(userDao.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        Optional<User> foundUser = userService.findByEmail("nonexistent@example.com");

        assertTrue(foundUser.isEmpty());
    }

    @Test
    void existsByEmail_True() {
        when(userDao.existsByEmail(testUser.getEmail())).thenReturn(true);

        boolean exists = userService.existsByEmail(testUser.getEmail());

        assertTrue(exists);
    }

    @Test
    void existsByEmail_False() {
        when(userDao.existsByEmail("nonexistent@example.com")).thenReturn(false);

        boolean exists = userService.existsByEmail("nonexistent@example.com");

        assertFalse(exists);
    }

    @Test
    void getAllUsers_Success() {
        List<User> userList = Collections.singletonList(testUser);
        Page<User> userPage = new PageImpl<>(userList);
        Pageable pageable = PageRequest.of(0, 10);

        when(userDao.findAll(any(Pageable.class))).thenReturn(userPage);

        Page<User> result = userService.getAllUsers(pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(testUser.getUsername(), result.getContent().get(0).getUsername());
    }

    @Test
    void createPasswordResetTokenForEmail_Success() {
        when(userDao.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(passwordResetTokenRepository.save(any(PasswordResetToken.class))).thenReturn(testToken);
        doNothing().when(emailService).sendPasswordResetVerificationCode(anyString(), anyString());

        PasswordResetToken result = userService.createPasswordResetTokenForEmail(testUser.getEmail());

        assertNotNull(result);
        assertEquals(testUser.getEmail(), result.getEmail());
        verify(passwordResetTokenRepository).save(any(PasswordResetToken.class));
        verify(emailService).sendPasswordResetVerificationCode(anyString(), anyString());
    }

    @Test
    void verifyPasswordResetCode_Success() {
        when(passwordResetTokenRepository.findFirstByEmailAndVerificationCodeAndUsedOrderByExpiryDateDesc(
            anyString(), anyString(), eq(false))).thenReturn(Optional.of(testToken));

        boolean result = userService.verifyPasswordResetCode(testUser.getEmail(), "123456");

        assertTrue(result);
    }

    @Test
    void resetPassword_Success() {
        when(passwordResetTokenRepository.findFirstByEmailAndVerificationCodeAndUsedOrderByExpiryDateDesc(
            anyString(), anyString(), eq(false))).thenReturn(Optional.of(testToken));
        when(userDao.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userDao.save(any(User.class))).thenReturn(testUser);

        boolean result = userService.resetPassword(testUser.getEmail(), "123456", "newPassword123");

        assertTrue(result);
        verify(userDao).save(any(User.class));
        verify(passwordResetTokenRepository).save(any(PasswordResetToken.class));
    }

    @Test
    void deleteUser_Success() {
        when(userDao.findById(anyLong())).thenReturn(Optional.of(testUser));
        doNothing().when(userDao).delete(any(User.class));

        userService.deleteUser(1L);

        verify(userDao).delete(any(User.class));
    }
} 