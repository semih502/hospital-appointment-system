package com.hospital.appointment.mapper;

import com.hospital.appointment.dto.request.DepartmentRequestDTO;
import com.hospital.appointment.dto.response.DepartmentResponseDTO;
import com.hospital.appointment.entity.Department;
import org.springframework.stereotype.Component;

/**
 * Departman entity ve DTO donusumlerini yapan mapper sinifi.
 */
@Component
public class DepartmentMapper {

    public Department toEntity(DepartmentRequestDTO dto) {
        if (dto == null) {
            return null;
        }
        return Department.builder()
                .name(dto.getName().trim())
                .build();
    }

    public DepartmentResponseDTO toDTO(Department entity) {
        if (entity == null) {
            return null;
        }
        return DepartmentResponseDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .doctorCount(entity.getDoctors() != null ? entity.getDoctors().size() : 0)
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
