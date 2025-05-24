package com.Football.Tournament;

import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;

/**
 * Base test class with common configuration for all tests
 * - Uses the test profile for H2 database
 * - Runs in a transactional context to rollback changes after each test
 */
@ExtendWith(SpringExtension.class)
@SpringBootTest
@ActiveProfiles("test")
@Transactional
public abstract class BaseTest {
    // Common test utilities and helper methods can be added here
}
