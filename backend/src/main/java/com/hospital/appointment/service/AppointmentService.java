package com.hospital.appointment.service;

import com.hospital.appointment.dto.request.AppointmentRequestDTO;
import com.hospital.appointment.dto.response.AppointmentResponseDTO;
import com.hospital.appointment.entity.enums.AppointmentStatus;
import com.hospital.appointment.entity.enums.Role;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Randevu yonetimi ve cift rezervasyon kontrol servis arayuzu.
 */
public interface AppointmentService {

    AppointmentResponseDTO createAppointment(AppointmentRequestDTO request, Long patientUserId);

    List<AppointmentResponseDTO> getMyAppointmentsAsPatient(Long patientUserId);

    List<AppointmentResponseDTO> getMyAppointmentsAsDoctor(Long doctorUserId);

    List<AppointmentResponseDTO> getAllAppointments();

    AppointmentResponseDTO updateAppointmentStatus(
            Long appointmentId,
            AppointmentStatus newStatus,
            Long currentUserId,
            Role currentUserRole
    );

    List<LocalDateTime> getBookedSlotsForDoctor(Long doctorId);

    void cancelAppointment(Long appointmentId, Long currentUserId, Role currentUserRole);
}
