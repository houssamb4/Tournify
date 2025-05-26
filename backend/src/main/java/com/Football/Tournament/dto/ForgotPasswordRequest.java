package com.Football.Tournament.dto;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

/**
 * DTO for forgot password request (first step)
 * Used to initiate the password reset process by providing an email
 */
public class ForgotPasswordRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    public ForgotPasswordRequest() {
    }

    public ForgotPasswordRequest(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
