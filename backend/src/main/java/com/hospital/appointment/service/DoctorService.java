package com.hospital.appointment.service;

import com.hospital.appointment.dto.request.DoctorRequestDTO;
import com.hospital.appointment.dto.response.DoctorResponseDTO;

import java.util.List;

/**
 * Doktor yonetimi servis arayuzu.
 */
public interface DoctorService {

    List<DoctorResponseDTO> getAllDoctors();

    DoctorResponseDTO getDoctorById(Long id);

    List<DoctorResponseDTO> getDoctorsByDepartment(Long departmentId);

    DoctorResponseDTO createDoctor(DoctorRequestDTO request);

    void deleteDoctor(Long id);
}
