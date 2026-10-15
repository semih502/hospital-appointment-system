package com.hospital.appointment.service.impl;

import com.hospital.appointment.dto.request.DepartmentRequestDTO;
import com.hospital.appointment.dto.response.DepartmentResponseDTO;
import com.hospital.appointment.entity.Department;
import com.hospital.appointment.exception.ResourceNotFoundException;
import com.hospital.appointment.mapper.DepartmentMapper;
import com.hospital.appointment.repository.DepartmentRepository;
import com.hospital.appointment.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Departman islemleri is mantigi gerceklesimi.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final DepartmentMapper departmentMapper;

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentResponseDTO> getAllDepartments() {
        return departmentRepository.findAll()
                .stream()
                .map(departmentMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public DepartmentResponseDTO getDepartmentById(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Departman bulunamadi. ID: " + id));
        return departmentMapper.toDTO(department);
    }

    @Override
    @Transactional
    public DepartmentResponseDTO createDepartment(DepartmentRequestDTO request) {
        if (departmentRepository.existsByNameIgnoreCase(request.getName())) {
            throw new IllegalArgumentException("Bu isimde bir departman zaten mevcut: " + request.getName());
        }

        Department department = departmentMapper.toEntity(request);
        Department saved = departmentRepository.save(department);
        log.info("Yeni departman olusturuldu: ID={}, Name={}", saved.getId(), saved.getName());

        return departmentMapper.toDTO(saved);
    }

    @Override
    @Transactional
    public DepartmentResponseDTO updateDepartment(Long id, DepartmentRequestDTO request) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Departman bulunamadi. ID: " + id));

        if (!department.getName().equalsIgnoreCase(request.getName())
                && departmentRepository.existsByNameIgnoreCase(request.getName())) {
            throw new IllegalArgumentException("Bu isimde baska bir departman zaten mevcut: " + request.getName());
        }

        department.setName(request.getName().trim());
        Department updated = departmentRepository.save(department);
        log.info("Departman guncellendi: ID={}, Name={}", updated.getId(), updated.getName());

        return departmentMapper.toDTO(updated);
    }

    @Override
    @Transactional
    public void deleteDepartment(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Departman bulunamadi. ID: " + id));

        departmentRepository.delete(department);
        log.info("Departman silindi: ID={}", id);
    }
}
