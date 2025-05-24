package com.Football.Tournament.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JwtAuthResponse {
    private String token;
    private String tokenType = "Bearer";
    
    public JwtAuthResponse(String token) {
        this.token = token;
    }
}
