package com.Football.Tournament.response;

import java.util.HashMap;
import java.util.Map;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;


//THIS CLASS IS USED FOR GENERATING CUSTOM JSON RESPONSE  FOR ALL CONTROLLER METHODS.
public class ResponseHandler {
public static ResponseEntity<Object> generateResponse(HttpStatus status, String message, Object responseObject) {
    Map<String, Object> map = new HashMap<String, Object>();

    map.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
    map.put("status", status.value());
    map.put("error", status.getReasonPhrase());
    map.put("message", message);
    map.put("data", responseObject);
    
    // Add additional error details for 415 errors
    if (status == HttpStatus.UNSUPPORTED_MEDIA_TYPE) {
        Map<String, String> errorDetails = new HashMap<>();
        errorDetails.put("expected", "application/json, application/json;charset=UTF-8");
        errorDetails.put("hint", "Please ensure your request includes one of these headers:\n" +
                               "Content-Type: application/json\n" +
                               "Content-Type: application/json;charset=UTF-8");
        map.put("errorDetails", errorDetails);
    }

    return new ResponseEntity<Object>(map, status);
}
}
