package com.Football.Tournament.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import com.Football.Tournament.response.ResponseHandler;
import java.util.stream.Collectors;
//This class will handle Global Exceptions
@ControllerAdvice
public class ExceptionController {
	
	@ExceptionHandler(HttpRequestMethodNotSupportedException.class)
	public ResponseEntity<Object> handleMethodNotSupportedException(HttpRequestMethodNotSupportedException e) {
		String supportedMethods = e.getSupportedHttpMethods().stream()
			.map(method -> method.toString())
			.collect(Collectors.joining(", "));
			
		String message = String.format(
			"Method '%s' is not supported. Supported methods are: [%s]",
			e.getMethod(),
			supportedMethods
		);
		return ResponseHandler.generateResponse(HttpStatus.METHOD_NOT_ALLOWED, message, null);
	}

}
