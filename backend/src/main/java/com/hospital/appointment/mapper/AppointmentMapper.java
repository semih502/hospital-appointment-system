package com.hospital.appointment.mapper;

import com.hospital.appointment.dto.response.AppointmentResponseDTO;
import com.hospital.appointment.entity.Appointment;
import org.springframework.stereotype.Component;

/**
 * Randevu entity ve DTO donusumlerini yapan mapper sinifi.
 */
@Component
public class AppointmentMapper {

    public AppointmentResponseDTO toDTO(Appointment entity) {
        if (entity == null) {
            return null;
        }

        return AppointmentResponseDTO.builder()
                .id(entity.getId())
                .patientId(entity.getPatient() != null ? entity.getPatient().getId() : null)
                .patientName(entity.getPatient() != null ? entity.getPatient().getName() : null)
                .patientEmail(entity.getPatient() != null ? entity.getPatient().getEmail() : null)
                .doctorId(entity.getDoctor() != null ? entity.getDoctor().getId() : null)
                .doctorName(entity.getDoctor() != null && entity.getDoctor().getUser() != null ? entity.getDoctor().getUser().getName() : null)
                .departmentName(entity.getDoctor() != null && entity.getDoctor().getDepartment() != null ? entity.getDoctor().getDepartment().getName() : null)
                .appointmentDate(entity.getAppointmentDate())
                .status(entity.getStatus())
                .version(entity.getVersion())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
