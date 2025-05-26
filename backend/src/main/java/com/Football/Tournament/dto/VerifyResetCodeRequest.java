package com.Football.Tournament.dto;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

/**
 * DTO for verifying a password reset code (second step)
 */
public class VerifyResetCodeRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Verification code is required")
    @Size(min = 6, max = 6, message = "Verification code must be 6 characters")
    private String code;

    public VerifyResetCodeRequest() {
    }

    public VerifyResetCodeRequest(String email, String code) {
        this.email = email;
        this.code = code;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
