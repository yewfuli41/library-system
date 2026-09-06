package com.workshop.library.exception;

import java.util.Map;

/** Custom error body shape returned by GlobalExceptionHandler - backend feature 6. */
public record ErrorResponse(int status, String message, Map<String, String> fieldErrors) {

    public ErrorResponse(int status, String message) {
        this(status, message, null);
    }
}
