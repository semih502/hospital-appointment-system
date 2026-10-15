package com.hospital.appointment.service.impl;

import com.hospital.appointment.dto.request.DoctorRequestDTO;
import com.hospital.appointment.dto.response.DoctorResponseDTO;
import com.hospital.appointment.entity.Department;
import com.hospital.appointment.entity.Doctor;
import com.hospital.appointment.entity.User;
import com.hospital.appointment.entity.enums.Role;
import com.hospital.appointment.exception.ResourceNotFoundException;
import com.hospital.appointment.exception.UserAlreadyExistsException;
import com.hospital.appointment.mapper.DoctorMapper;
import com.hospital.appointment.repository.DepartmentRepository;
import com.hospital.appointment.repository.DoctorRepository;
import com.hospital.appointment.repository.UserRepository;
import com.hospital.appointment.service.DoctorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

/**
 * Doktor operasyonlarinin is mantigi gerceklesimi.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final DoctorMapper doctorMapper;

    @Override
    @Transactional(readOnly = true)
    public List<DoctorResponseDTO> getAllDoctors() {
        return doctorRepository.findAllWithDetails()
                .stream()
                .map(doctorMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public DoctorResponseDTO getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doktor bulunamadi. ID: " + id));
        return doctorMapper.toDTO(doctor);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DoctorResponseDTO> getDoctorsByDepartment(Long departmentId) {
        if (!departmentRepository.existsById(departmentId)) {
            throw new ResourceNotFoundException("Departman bulunamadi. ID: " + departmentId);
        }
        return doctorRepository.findByDepartmentIdWithDetails(departmentId)
                .stream()
                .map(doctorMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional
    public DoctorResponseDTO createDoctor(DoctorRequestDTO request) {
        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Departman bulunamadi. ID: " + request.getDepartmentId()));

        User user;
        if (request.getUserId() != null) {
            user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("Kullanici bulunamadi. ID: " + request.getUserId()));

            if (doctorRepository.existsByUserId(user.getId())) {
                throw new IllegalArgumentException("Bu kullanici hesabi zaten bir doktora baglidir.");
            }

            user.setRole(Role.DOCTOR);
            userRepository.save(user);
        } else {
            if (!StringUtils.hasText(request.getName()) || !StringUtils.hasText(request.getEmail()) || !StringUtils.hasText(request.getPassword())) {
                throw new IllegalArgumentException("Yeni doktor hesabi icin isim, e-posta ve sifre alanlari zorunludur.");
            }

            if (userRepository.existsByEmail(request.getEmail())) {
                throw new UserAlreadyExistsException("Bu e-posta adresiyle kayitli bir hesap zaten mevcut: " + request.getEmail());
            }

            user = User.builder()
                    .name(request.getName().trim())
                    .email(request.getEmail().trim().toLowerCase())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .role(Role.DOCTOR)
                    .build();

            user = userRepository.save(user);
        }

        Doctor doctor = Doctor.builder()
                .user(user)
                .department(department)
                .build();

        Doctor savedDoctor = doctorRepository.save(doctor);
        log.info("Yeni doktor kaydi olusturuldu: DoktorID={}, UserID={}, DepartmanID={}",
                savedDoctor.getId(), user.getId(), department.getId());

        return doctorMapper.toDTO(savedDoctor);
    }

    @Override
    @Transactional
    public void deleteDoctor(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doktor bulunamadi. ID: " + id));

        doctorRepository.delete(doctor);
        log.info("Doktor silindi: ID={}", id);
    }
}
