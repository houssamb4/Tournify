package com.Football.Tournament.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EmailServiceTest {

    @Mock
    private JavaMailSender emailSender;

    @InjectMocks
    private EmailService emailService;

    private String testEmail;
    private String testSubject;
    private String testMessage;

    @BeforeEach
    void setUp() {
        testEmail = "test@example.com";
        testSubject = "Test Subject";
        testMessage = "Test Message";
    }

    @Test
    void sendSimpleMessage_Success() {
        // Arrange
        doNothing().when(emailSender).send(any(SimpleMailMessage.class));

        // Act
        emailService.sendSimpleMessage(testEmail, testSubject, testMessage);

        // Assert
        verify(emailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    @Test
    void sendSimpleMessage_HandlesException() {
        // Arrange
        doThrow(new RuntimeException("Mail server error"))
            .when(emailSender).send(any(SimpleMailMessage.class));

        // Act - should not throw exception
        emailService.sendSimpleMessage(testEmail, testSubject, testMessage);

        // Assert
        verify(emailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    @Test
    void sendPasswordResetVerificationCode_Success() {
        // Arrange
        String verificationCode = "123456";
        doNothing().when(emailSender).send(any(SimpleMailMessage.class));

        // Act
        emailService.sendPasswordResetVerificationCode(testEmail, verificationCode);

        // Assert
        verify(emailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    @Test
    void sendPasswordResetVerificationCode_HandlesException() {
        // Arrange
        String verificationCode = "123456";
        doThrow(new RuntimeException("Mail server error"))
            .when(emailSender).send(any(SimpleMailMessage.class));

        // Act - should not throw exception
        emailService.sendPasswordResetVerificationCode(testEmail, verificationCode);

        // Assert
        verify(emailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    @Test
    void sendPasswordResetLink_Success() {
        // Arrange
        String resetLink = "http://example.com/reset";
        doNothing().when(emailSender).send(any(SimpleMailMessage.class));

        // Act
        emailService.sendPasswordResetLink(testEmail, resetLink);

        // Assert
        verify(emailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    @Test
    void sendPasswordResetLink_HandlesException() {
        // Arrange
        String resetLink = "http://example.com/reset";
        doThrow(new RuntimeException("Mail server error"))
            .when(emailSender).send(any(SimpleMailMessage.class));

        // Act - should not throw exception
        emailService.sendPasswordResetLink(testEmail, resetLink);

        // Assert
        verify(emailSender, times(1)).send(any(SimpleMailMessage.class));
    }
}