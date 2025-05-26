package com.Football.Tournament.exception;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.context.request.WebRequest;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class GlobalExceptionHandlerTest {

    @InjectMocks
    private GlobalExceptionHandler globalExceptionHandler;

    @Mock
    private WebRequest webRequest;

    @Test
    void handleHttpMediaTypeNotSupported_Success() {
        // Arrange
        MediaType unsupportedType = MediaType.TEXT_PLAIN;
        List<MediaType> supportedTypes = new ArrayList<>();
        supportedTypes.add(MediaType.APPLICATION_JSON);
        
        HttpMediaTypeNotSupportedException ex = mock(HttpMediaTypeNotSupportedException.class);
        when(ex.getContentType()).thenReturn(unsupportedType);
        when(ex.getSupportedMediaTypes()).thenReturn(supportedTypes);

        // Act
        ResponseEntity<Object> response = globalExceptionHandler.handleHttpMediaTypeNotSupported(ex, webRequest);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.UNSUPPORTED_MEDIA_TYPE, response.getStatusCode());
        
        @SuppressWarnings("unchecked")
        Map<String, Object> responseBody = (Map<String, Object>) response.getBody();
        assertNotNull(responseBody);
        assertTrue(responseBody.get("message").toString().contains("Media type not supported"));
        assertTrue(responseBody.get("message").toString().contains(unsupportedType.toString()));
    }

    @Test
    void handleAllUncaughtException_Success() {
        // Arrange
        String errorMessage = "Test error message";
        Exception ex = new RuntimeException(errorMessage);

        // Act
        ResponseEntity<Object> response = globalExceptionHandler.handleAllUncaughtException(ex, webRequest);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        
        @SuppressWarnings("unchecked")
        Map<String, Object> responseBody = (Map<String, Object>) response.getBody();
        assertNotNull(responseBody);
        assertTrue(responseBody.get("message").toString().contains(errorMessage));
    }
} 