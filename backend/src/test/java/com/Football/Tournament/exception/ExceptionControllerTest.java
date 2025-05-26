package com.Football.Tournament.exception;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpRequestMethodNotSupportedException;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ExceptionControllerTest {

    @InjectMocks
    private ExceptionController exceptionController;

    @Test
    void handleMethodNotSupportedException_Success() {
        // Arrange
        Set<HttpMethod> supportedMethods = new HashSet<>();
        supportedMethods.add(HttpMethod.GET);
        supportedMethods.add(HttpMethod.PUT);
        
        HttpRequestMethodNotSupportedException ex = mock(HttpRequestMethodNotSupportedException.class);
        when(ex.getMethod()).thenReturn("POST");
        when(ex.getSupportedHttpMethods()).thenReturn(supportedMethods);

        // Act
        ResponseEntity<Object> response = exceptionController.handleMethodNotSupportedException(ex);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.METHOD_NOT_ALLOWED, response.getStatusCode());
        
        @SuppressWarnings("unchecked")
        Map<String, Object> responseBody = (Map<String, Object>) response.getBody();
        assertNotNull(responseBody);
        String message = responseBody.get("message").toString();
        assertTrue(message.contains("Method 'POST' is not supported"), "Message should contain unsupported method");
        assertTrue(message.contains("Supported methods are: [GET, PUT]") || message.contains("Supported methods are: [PUT, GET]"), 
                "Message should contain supported methods");
    }
} 