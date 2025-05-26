package com.Football.Tournament.response;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class ResponseHandlerTest {

    @Test
    void generateResponse_Success() {
        // Arrange
        HttpStatus status = HttpStatus.OK;
        String message = "Test message";
        Object data = "Test data";

        // Act
        ResponseEntity<Object> response = ResponseHandler.generateResponse(status, message, data);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        
        @SuppressWarnings("unchecked")
        Map<String, Object> responseBody = (Map<String, Object>) response.getBody();
        assertNotNull(responseBody);
        assertEquals(HttpStatus.OK.value(), responseBody.get("status"));
        assertEquals(message, responseBody.get("message"));
        assertEquals(data, responseBody.get("data"));
        assertNotNull(responseBody.get("timestamp"));
    }

    @Test
    void generateResponse_WithNullData() {
        // Arrange
        HttpStatus status = HttpStatus.NOT_FOUND;
        String message = "Not found";

        // Act
        ResponseEntity<Object> response = ResponseHandler.generateResponse(status, message, null);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        
        @SuppressWarnings("unchecked")
        Map<String, Object> responseBody = (Map<String, Object>) response.getBody();
        assertNotNull(responseBody);
        assertEquals(HttpStatus.NOT_FOUND.value(), responseBody.get("status"));
        assertEquals(message, responseBody.get("message"));
        assertNull(responseBody.get("data"));
    }

    @Test
    void generateResponse_UnsupportedMediaType() {
        // Arrange
        HttpStatus status = HttpStatus.UNSUPPORTED_MEDIA_TYPE;
        String message = "Unsupported media type";

        // Act
        ResponseEntity<Object> response = ResponseHandler.generateResponse(status, message, null);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.UNSUPPORTED_MEDIA_TYPE, response.getStatusCode());
        
        @SuppressWarnings("unchecked")
        Map<String, Object> responseBody = (Map<String, Object>) response.getBody();
        assertNotNull(responseBody);
        assertEquals(HttpStatus.UNSUPPORTED_MEDIA_TYPE.value(), responseBody.get("status"));
        assertEquals(message, responseBody.get("message"));
        
        @SuppressWarnings("unchecked")
        Map<String, String> errorDetails = (Map<String, String>) responseBody.get("errorDetails");
        assertNotNull(errorDetails);
        assertTrue(errorDetails.get("expected").contains("application/json"));
        assertTrue(errorDetails.get("hint").contains("Content-Type"));
    }
} 