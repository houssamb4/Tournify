package com.Football.Tournament.dto;

/**
 * DTO for forgot password response
 */
public class ForgotPasswordResponse {
    private boolean success;
    private String message;
    private String email; // User's email address
    private boolean requiresVerification; // Whether verification is needed

    public ForgotPasswordResponse() {
    }

    public ForgotPasswordResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public ForgotPasswordResponse(boolean success, String message, String email, boolean requiresVerification) {
        this.success = success;
        this.message = message;
        this.email = email;
        this.requiresVerification = requiresVerification;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isRequiresVerification() {
        return requiresVerification;
    }

    public void setRequiresVerification(boolean requiresVerification) {
        this.requiresVerification = requiresVerification;
    }
}
