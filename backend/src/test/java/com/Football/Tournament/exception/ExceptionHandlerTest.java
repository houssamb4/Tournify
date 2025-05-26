package com.Football.Tournament.exception;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.context.request.WebRequest;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class ExceptionHandlerTest {

    @InjectMocks
    private ExceptionController exceptionController;

    @InjectMocks
    private GlobalExceptionHandler globalExceptionHandler;

    @Test
    void handleMethodNotSupportedException_Success() {
        // Arrange
        Set<HttpMethod> supportedMethods = new HashSet<>();
        supportedMethods.add(HttpMethod.GET);
        supportedMethods.add(HttpMethod.POST);
        
        HttpRequestMethodNotSupportedException ex = mock(HttpRequestMethodNotSupportedException.class);
        when(ex.getMethod()).thenReturn("PUT");
        when(ex.getSupportedHttpMethods()).thenReturn(supportedMethods);

        // Act
        ResponseEntity<Object> response = exceptionController.handleMethodNotSupportedException(ex);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.METHOD_NOT_ALLOWED, response.getStatusCode());
        
        @SuppressWarnings("unchecked")
        Map<String, Object> responseBody = (Map<String, Object>) response.getBody();
        assertNotNull(responseBody);
        assertTrue(responseBody.get("message").toString().contains("Method 'PUT' is not supported"));
    }

    @Test
    void handleHttpMediaTypeNotSupported_Success() {
        // Arrange
        MediaType unsupportedType = MediaType.TEXT_PLAIN;
        List<MediaType> supportedTypes = new ArrayList<>();
        supportedTypes.add(MediaType.APPLICATION_JSON);
        
        HttpMediaTypeNotSupportedException ex = mock(HttpMediaTypeNotSupportedException.class);
        when(ex.getContentType()).thenReturn(unsupportedType);
        when(ex.getSupportedMediaTypes()).thenReturn(supportedTypes);
        
        WebRequest request = mock(WebRequest.class);

        // Act
        ResponseEntity<Object> response = globalExceptionHandler.handleHttpMediaTypeNotSupported(ex, request);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.UNSUPPORTED_MEDIA_TYPE, response.getStatusCode());
        
        @SuppressWarnings("unchecked")
        Map<String, Object> responseBody = (Map<String, Object>) response.getBody();
        assertNotNull(responseBody);
        assertTrue(responseBody.get("message").toString().contains("Media type not supported"));
    }

    @Test
    void handleAllUncaughtException_Success() {
        // Arrange
        Exception ex = new RuntimeException("Test exception");
        WebRequest request = mock(WebRequest.class);

        // Act
        ResponseEntity<Object> response = globalExceptionHandler.handleAllUncaughtException(ex, request);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        
        @SuppressWarnings("unchecked")
        Map<String, Object> responseBody = (Map<String, Object>) response.getBody();
        assertNotNull(responseBody);
        assertTrue(responseBody.get("message").toString().contains("Test exception"));
    }
} 