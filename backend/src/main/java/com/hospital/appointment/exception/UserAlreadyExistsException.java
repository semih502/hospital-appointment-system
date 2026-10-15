package com.hospital.appointment.exception;

/**
 * Zaten kayitli bir e-posta ile yeni kullanici acilmaya calisildiginda firlatilan istisna.
 */
public class UserAlreadyExistsException extends RuntimeException {

    public UserAlreadyExistsException(String message) {
        super(message);
    }
}
