package com.hospital.appointment.repository;

import com.hospital.appointment.entity.Appointment;
import com.hospital.appointment.entity.enums.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

/**
 * Randevu veri erisim katmani. Cift rezervasyon kontrol sorgulari ve JOIN FETCH ile N+1 korumasi saglar.
 */
@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    /**
     * Doktorun belirtilen tarihte aktif (PENDING veya CONFIRMED) bir randevusu olup olmadigini kontrol eder.
     */
    boolean existsByDoctorIdAndAppointmentDateAndStatusIn(
            Long doctorId,
            LocalDateTime appointmentDate,
            Collection<AppointmentStatus> statuses
    );

    /**
     * Hastanin belirtilen saatte baska bir aktif randevusu olup olmadigini kontrol eder.
     */
    boolean existsByPatientIdAndAppointmentDateAndStatusIn(
            Long patientId,
            LocalDateTime appointmentDate,
            Collection<AppointmentStatus> statuses
    );

    /**
     * Belirli bir doktorun belirli bir durumdaki tum randevularini getirir (Takvim slotlarini doldurmak icin).
     */
    List<Appointment> findByDoctorIdAndStatusIn(
            Long doctorId,
            Collection<AppointmentStatus> statuses
    );

    /**
     * Belirli bir doktorun belirtilen tarih araligindaki aktif randevularini getirir.
     */
    List<Appointment> findByDoctorIdAndAppointmentDateBetweenAndStatusIn(
            Long doctorId,
            LocalDateTime start,
            LocalDateTime end,
            Collection<AppointmentStatus> statuses
    );

    /**
     * Hastanin tum randevularini iliskili detaylarla birlikte getirir.
     */
    @Query("SELECT a FROM Appointment a " +
           "JOIN FETCH a.patient " +
           "JOIN FETCH a.doctor d " +
           "JOIN FETCH d.user " +
           "JOIN FETCH d.department " +
           "WHERE a.patient.id = :patientId " +
           "ORDER BY a.appointmentDate DESC")
    List<Appointment> findByPatientIdWithDetails(@Param("patientId") Long patientId);

    /**
     * Doktorun tum randevularini iliskili detaylarla birlikte getirir.
     */
    @Query("SELECT a FROM Appointment a " +
           "JOIN FETCH a.patient " +
           "JOIN FETCH a.doctor d " +
           "JOIN FETCH d.user " +
           "JOIN FETCH d.department " +
           "WHERE d.id = :doctorId " +
           "ORDER BY a.appointmentDate DESC")
    List<Appointment> findByDoctorIdWithDetails(@Param("doctorId") Long doctorId);

    /**
     * Tum randevulari yonetici (ADMIN) gorunumu icin iliskili detaylarla getirir.
     */
    @Query("SELECT a FROM Appointment a " +
           "JOIN FETCH a.patient " +
           "JOIN FETCH a.doctor d " +
           "JOIN FETCH d.user " +
           "JOIN FETCH d.department " +
           "ORDER BY a.appointmentDate DESC")
    List<Appointment> findAllWithDetails();

    /**
     * Tek bir randevuyu tum iliskileriyle eager yukler.
     */
    @Query("SELECT a FROM Appointment a " +
           "JOIN FETCH a.patient " +
           "JOIN FETCH a.doctor d " +
           "JOIN FETCH d.user " +
           "JOIN FETCH d.department " +
           "WHERE a.id = :id")
    Optional<Appointment> findByIdWithDetails(@Param("id") Long id);
}
