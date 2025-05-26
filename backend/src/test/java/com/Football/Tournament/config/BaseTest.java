package com.Football.Tournament.config;

import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@ContextConfiguration(classes = {TestConfig.class})
@ActiveProfiles("test")
@Transactional
@AutoConfigureMockMvc
@WithMockUser(username = "testuser", roles = {"USER", "ADMIN"})
public abstract class BaseTest {
    // Common test utilities and helper methods can be added here
    
    protected void clearDatabase() {
        // Add methods to clear test data if needed
    }
} 