package com.example.demo.exception;

/**
 * Exception thrown when an Item is not found.
 */
public class ItemNotFoundException extends RuntimeException {

    public ItemNotFoundException(Long id) {
        super("Item not found with id: " + id);
    }

    public ItemNotFoundException(String message) {
        super(message);
    }
}
