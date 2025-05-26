package com.Football.Tournament.entities;

import java.time.LocalDateTime;
import javax.persistence.*;

/**
 * Entity for storing password reset verification codes
 */
@Entity
@Table(name = "password_reset_tokens")
public class PasswordResetToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String verificationCode;
    
    @Column(nullable = false)
    private LocalDateTime expiryDate;
    
    @Column(nullable = false)
    private boolean used;
    
    public PasswordResetToken() {
    }
    
    public PasswordResetToken(String email, String verificationCode, LocalDateTime expiryDate) {
        this.email = email;
        this.verificationCode = verificationCode;
        this.expiryDate = expiryDate;
        this.used = false;
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getVerificationCode() {
        return verificationCode;
    }
    
    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }
    
    public LocalDateTime getExpiryDate() {
        return expiryDate;
    }
    
    public void setExpiryDate(LocalDateTime expiryDate) {
        this.expiryDate = expiryDate;
    }
    
    public boolean isUsed() {
        return used;
    }
    
    public void setUsed(boolean used) {
        this.used = used;
    }
    
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiryDate);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PasswordResetToken that = (PasswordResetToken) o;
        return used == that.used &&
               java.util.Objects.equals(id, that.id) &&
               java.util.Objects.equals(email, that.email) &&
               java.util.Objects.equals(verificationCode, that.verificationCode) &&
               java.util.Objects.equals(expiryDate, that.expiryDate);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id, email, verificationCode, expiryDate, used);
    }

    @Override
    public String toString() {
        return "PasswordResetToken{" +
               "id=" + id +
               ", email='" + email + '\'' +
               ", verificationCode='" + verificationCode + '\'' +
               ", expiryDate=" + expiryDate +
               ", used=" + used +
               '}';
    }
}
