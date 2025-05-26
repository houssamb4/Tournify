package com.Football.Tournament.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import com.Football.Tournament.response.ResponseHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<Object> handleHttpMediaTypeNotSupported(
            HttpMediaTypeNotSupportedException ex, WebRequest request) {
        
        String errorMessage = String.format(
            "Media type not supported. Received: %s. Supported: %s",
            ex.getContentType(),
            ex.getSupportedMediaTypes()
        );
        
        return ResponseHandler.generateResponse(
            HttpStatus.UNSUPPORTED_MEDIA_TYPE,
            errorMessage,
            null
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleAllUncaughtException(
            Exception ex, WebRequest request) {
        
        return ResponseHandler.generateResponse(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "An unexpected error occurred: " + ex.getMessage(),
            null
        );
    }
} 