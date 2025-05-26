package com.Football.Tournament.services;

import com.Football.Tournament.entities.User;
import com.Football.Tournament.entities.PasswordResetToken;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public interface UserService {
    
    public User createUser(User user);
    
    public User updateUser(User user);
    
    public Optional<User> getUserById(Long id);
    
    public Optional<User> findByUsername(String username);
    
    public Optional<User> findByEmail(String email);
    
    public Optional<User> findByUsernameOrEmail(String usernameOrEmail);
    
    public Page<User> getAllUsers(Pageable pageable);
    
    public List<User> getAllUsers();
    
    public boolean existsByUsername(String username);
    
    public boolean existsByEmail(String email);
    
    public void deleteUser(Long id);
    
    /**
     * Creates a password reset verification code and sends it to the user's email
     * @param email The email of the user requesting password reset
     * @return The created PasswordResetToken or null if user not found
     */
    public PasswordResetToken createPasswordResetTokenForEmail(String email);
    
    /**
     * Verifies if the provided code matches the stored verification code for the given email
     * @param email The email of the user
     * @param code The verification code to check
     * @return true if verification is successful, false otherwise
     */
    public boolean verifyPasswordResetCode(String email, String code);
    
    /**
     * Resets the user password after successful verification
     * @param email The email of the user
     * @param code The verification code
     * @param newPassword The new password
     * @return true if password was reset successfully, false otherwise
     */
    public boolean resetPassword(String email, String code, String newPassword);
}
