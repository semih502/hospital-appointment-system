package com.hospital.appointment.controller;

import com.hospital.appointment.dto.request.DoctorRequestDTO;
import com.hospital.appointment.dto.response.ApiResponseDTO;
import com.hospital.appointment.dto.response.DoctorResponseDTO;
import com.hospital.appointment.service.DoctorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Doktor yonetimi REST Controller uclari.
 */
@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
@Tag(name = "Doctor Management", description = "Doktorlarin listelenmesi, departmana gore filtreleme ve ADMIN islemleri")
public class DoctorController {

    private final DoctorService doctorService;

    @GetMapping
    @Operation(summary = "Tum doktorlari listele", description = "Sistemdeki tum doktorlari detaylariyla getirir.")
    public ResponseEntity<List<DoctorResponseDTO>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Doktor detayi getir", description = "Belirtilen ID'ye sahip doktor profilini dondurur.")
    public ResponseEntity<DoctorResponseDTO> getDoctorById(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getDoctorById(id));
    }

    @GetMapping("/department/{departmentId}")
    @Operation(summary = "Departmana gore doktorlari listele", description = "Belirtilen tibbi departmandaki doktorlari filtreler.")
    public ResponseEntity<List<DoctorResponseDTO>> getDoctorsByDepartment(@PathVariable Long departmentId) {
        return ResponseEntity.ok(doctorService.getDoctorsByDepartment(departmentId));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Yeni doktor tanimla (Sadece ADMIN)", description = "Sisteme yeni doktor ekler veya var olan kullaniciyi doktora atar.")
    public ResponseEntity<DoctorResponseDTO> createDoctor(@Valid @RequestBody DoctorRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(doctorService.createDoctor(request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Doktor kaydini kaldir (Sadece ADMIN)", description = "Doktor profilini sistemden siler.")
    public ResponseEntity<ApiResponseDTO<Void>> deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.ok(ApiResponseDTO.success("Doktor kaydi basariyla silindi."));
    }
}
