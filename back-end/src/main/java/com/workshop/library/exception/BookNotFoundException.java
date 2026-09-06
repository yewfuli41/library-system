package com.workshop.library.exception;

/**
 * Thrown when a requested book id does not exist. Handled by GlobalExceptionHandler
 * to satisfy Spring Boot compulsory feature #6 (custom error messages + HTTP status codes).
 */
public class BookNotFoundException extends RuntimeException {

    public BookNotFoundException(Long id) {
        super("Book not found with id: " + id);
    }
}
