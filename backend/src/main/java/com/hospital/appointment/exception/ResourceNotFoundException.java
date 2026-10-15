package com.hospital.appointment.exception;

/**
 * Istenen kaynak (User, Doctor, Department, Appointment) bulunamadiginda firlatilan istisna.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
