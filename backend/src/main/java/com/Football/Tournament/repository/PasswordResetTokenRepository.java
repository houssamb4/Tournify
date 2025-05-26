package com.Football.Tournament.repository;

import com.Football.Tournament.entities.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    /**
     * Find the most recent unused token for a given email and verification code
     */
    Optional<PasswordResetToken> findFirstByEmailAndVerificationCodeAndUsedOrderByExpiryDateDesc(
            String email, String verificationCode, boolean used);
    
    /**
     * Find the most recent token for a given email (used or unused)
     */
    Optional<PasswordResetToken> findFirstByEmailOrderByExpiryDateDesc(String email);
}
