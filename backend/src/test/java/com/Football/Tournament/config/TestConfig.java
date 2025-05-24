package com.Football.Tournament.config;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * Test configuration class for Spring Boot tests
 * This configuration will override the main application configuration for tests
 */
@TestConfiguration
public class TestConfig {
    
    /**
     * Password encoder bean for test environment
     * @return BCryptPasswordEncoder instance
     */
    @Bean
    @Primary
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
