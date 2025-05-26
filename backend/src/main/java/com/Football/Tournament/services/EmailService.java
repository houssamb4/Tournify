package com.Football.Tournament.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Service for sending emails
 */
@Service
public class EmailService {
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    
    // Email sender bean configured in application.properties
    @Autowired
    private JavaMailSender emailSender;
    
    /**
     * Send a simple text email
     * @param to Recipient email address
     * @param subject Email subject
     * @param text Email body text
     */
    public void sendSimpleMessage(String to, String subject, String text) {
        try {
            logger.info("=== SENDING EMAIL ===");
            logger.info("To: {}", to);
            logger.info("Subject: {}", subject);
            logger.info("Text: {}", text);
            
            // Send actual email
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            emailSender.send(message);
            
            logger.info("=== EMAIL SENT SUCCESSFULLY ===");
        } catch (Exception e) {
            logger.error("Failed to send email", e);
        }
    }
    
    /**
     * Send password reset verification code
     * @param to User's email address
     * @param verificationCode The 6-digit verification code
     */
    public void sendPasswordResetVerificationCode(String to, String verificationCode) {
        String subject = "Your Password Reset Verification Code";
        String text = "Your password reset verification code is: " + verificationCode + 
                      "\n\nThis code will expire in 15 minutes. " +
                      "Please enter this code in the app to continue with your password reset process.";
        
        sendSimpleMessage(to, subject, text);
    }
    
    /**
     * Send password reset confirmation with link
     * @param to User's email address
     * @param resetLink Link to reset password page
     */
    public void sendPasswordResetLink(String to, String resetLink) {
        String subject = "Reset Your Password";
        String text = "Please click on the link below to reset your password:\n\n" +
                      resetLink + "\n\n" +
                      "This link will expire in 24 hours. If you did not request a password reset, " +
                      "please ignore this email or contact support if you have concerns.";
        
        sendSimpleMessage(to, subject, text);
    }
}
