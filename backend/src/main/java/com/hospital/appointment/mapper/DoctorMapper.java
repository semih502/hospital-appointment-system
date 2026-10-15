package com.hospital.appointment.mapper;

import com.hospital.appointment.dto.response.DoctorResponseDTO;
import com.hospital.appointment.entity.Doctor;
import org.springframework.stereotype.Component;

/**
 * Doktor entity ve DTO donusumlerini yapan mapper sinifi.
 */
@Component
public class DoctorMapper {

    public DoctorResponseDTO toDTO(Doctor entity) {
        if (entity == null) {
            return null;
        }

        return DoctorResponseDTO.builder()
                .id(entity.getId())
                .userId(entity.getUser() != null ? entity.getUser().getId() : null)
                .name(entity.getUser() != null ? entity.getUser().getName() : null)
                .email(entity.getUser() != null ? entity.getUser().getEmail() : null)
                .departmentId(entity.getDepartment() != null ? entity.getDepartment().getId() : null)
                .departmentName(entity.getDepartment() != null ? entity.getDepartment().getName() : null)
                .build();
    }
}
