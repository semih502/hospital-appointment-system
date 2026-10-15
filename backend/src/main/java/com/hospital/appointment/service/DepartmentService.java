package com.hospital.appointment.service;

import com.hospital.appointment.dto.request.DepartmentRequestDTO;
import com.hospital.appointment.dto.response.DepartmentResponseDTO;

import java.util.List;

/**
 * Departman yonetimi servis arayuzu.
 */
public interface DepartmentService {

    List<DepartmentResponseDTO> getAllDepartments();

    DepartmentResponseDTO getDepartmentById(Long id);

    DepartmentResponseDTO createDepartment(DepartmentRequestDTO request);

    DepartmentResponseDTO updateDepartment(Long id, DepartmentRequestDTO request);

    void deleteDepartment(Long id);
}
