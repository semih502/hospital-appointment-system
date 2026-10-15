package com.hospital.appointment.exception;

/**
 * Randevu cakismasi (ayni doktor veya ayni hastaya cift rezervasyon denemesi)
 * durumunda firlatilan is istisnasi.
 */
public class AppointmentConflictException extends RuntimeException {

    public AppointmentConflictException(String message) {
        super(message);
    }
}
