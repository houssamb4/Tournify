package com.Football.Tournament.services;

import com.Football.Tournament.dao.UserDao;
import com.Football.Tournament.entities.User;
import com.Football.Tournament.entities.PasswordResetToken;
import com.Football.Tournament.exception.ResourceNotFoundException;
import com.Football.Tournament.repository.PasswordResetTokenRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class UserServiceImpl implements UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);
    
    @Autowired
    private UserDao userDao;
    
    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private EmailService emailService;

    @Override
    public User createUser(User user) {
        return userDao.save(user);
    }

    @Override
    public User updateUser(User user) {
        return userDao.save(user);
    }

    @Override
    public Optional<User> getUserById(Long id) {
        return userDao.findById(id);
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return userDao.findByUsername(username);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userDao.findByEmail(email);
    }

    @Override
    public Optional<User> findByUsernameOrEmail(String usernameOrEmail) {
        return userDao.findByUsernameOrEmail(usernameOrEmail);
    }

    @Override
    public Page<User> getAllUsers(Pageable pageable) {
        return userDao.findAll(pageable);
    }

    @Override
    public List<User> getAllUsers() {
        return userDao.findAll();
    }

    @Override
    public boolean existsByUsername(String username) {
        return userDao.existsByUsername(username);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userDao.existsByEmail(email);
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        User user = userDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        userDao.delete(user);
    }
    
    @Override
    public PasswordResetToken createPasswordResetTokenForEmail(String email) {
        logger.info("=== CREATE PASSWORD RESET TOKEN STARTED ===");
        logger.debug("Creating password reset token for email: {}", email);
        
        Optional<User> userOpt = findByEmail(email);
        if (!userOpt.isPresent()) {
            logger.warn("No user found with email: {}", email);
            return null;
        }
        
        // Generate a 6-character verification code (numeric)
        String verificationCode = generateVerificationCode();
        logger.debug("Generated verification code: {}", verificationCode);
        
        // Set expiry to 15 minutes from now
        LocalDateTime expiryDate = LocalDateTime.now().plusMinutes(15);
        
        // Create the token entity
        PasswordResetToken token = new PasswordResetToken(email, verificationCode, expiryDate);
        passwordResetTokenRepository.save(token);
        logger.debug("Password reset token saved to database with ID: {}", token.getId());
        
        // Send the verification code via email
        emailService.sendPasswordResetVerificationCode(email, verificationCode);
        logger.info("Verification code sent to email: {}", email);
        
        logger.info("=== CREATE PASSWORD RESET TOKEN COMPLETED SUCCESSFULLY ===");
        return token;
    }
    
    @Override
    public boolean verifyPasswordResetCode(String email, String code) {
        logger.info("=== VERIFY PASSWORD RESET CODE STARTED ===");
        logger.debug("Verifying code for email: {}", email);
        
        Optional<PasswordResetToken> tokenOpt = 
            passwordResetTokenRepository.findFirstByEmailAndVerificationCodeAndUsedOrderByExpiryDateDesc(
                email, code, false);
        
        if (!tokenOpt.isPresent()) {
            logger.warn("No matching unused token found for email: {}", email);
            return false;
        }
        
        PasswordResetToken token = tokenOpt.get();
        
        // Check if token is expired
        if (token.isExpired()) {
            logger.warn("Token is expired for email: {}", email);
            return false;
        }
        
        logger.info("=== VERIFY PASSWORD RESET CODE COMPLETED SUCCESSFULLY ===");
        return true;
    }
    
    @Override
    @Transactional
    public boolean resetPassword(String email, String code, String newPassword) {
        logger.info("=== RESET PASSWORD STARTED ===");
        logger.debug("Attempting to reset password for email: {}", email);
        
        // First verify the code
        if (!verifyPasswordResetCode(email, code)) {
            logger.warn("Verification failed for password reset - email: {}", email);
            return false;
        }
        
        Optional<User> userOpt = findByEmail(email);
        if (!userOpt.isPresent()) {
            logger.warn("No user found with email: {}", email);
            return false;
        }
        
        User user = userOpt.get();
        
        // Update the password
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(LocalDateTime.now());
        updateUser(user);
        logger.debug("Password updated for user ID: {}", user.getId());
        
        // Mark all tokens for this email as used
        Optional<PasswordResetToken> tokenOpt = passwordResetTokenRepository
            .findFirstByEmailAndVerificationCodeAndUsedOrderByExpiryDateDesc(email, code, false);
        
        if (tokenOpt.isPresent()) {
            PasswordResetToken token = tokenOpt.get();
            token.setUsed(true);
            passwordResetTokenRepository.save(token);
            logger.debug("Token marked as used for email: {}", email);
            
            // Send a password reset confirmation email
            String resetLink = "http://localhost:8081"; // Base URL of the frontend app
            emailService.sendPasswordResetLink(email, resetLink);
            logger.info("Password reset confirmation email sent to: {}", email);
        }
        
        logger.info("=== RESET PASSWORD COMPLETED SUCCESSFULLY ===");
        return true;
    }
    
    /**
     * Generate a random 6-digit verification code
     */
    private String generateVerificationCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000); // 6-digit code between 100000 and 999999
        return String.valueOf(code);
    }
}
