package com.hospital.appointment.controller;

import com.hospital.appointment.dto.request.DepartmentRequestDTO;
import com.hospital.appointment.dto.response.ApiResponseDTO;
import com.hospital.appointment.dto.response.DepartmentResponseDTO;
import com.hospital.appointment.service.DepartmentService;
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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Departman yonetimi REST Controller uclari.
 */
@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
@Tag(name = "Department Management", description = "Tibbi bolumlerin ve departmanlarin listelenmesi ve yonetimi")
public class DepartmentController {

    private final DepartmentService departmentService;

    @GetMapping
    @Operation(summary = "Tum departmanlari listele", description = "Sistemdeki tum aktif departmanlari getirir.")
    public ResponseEntity<List<DepartmentResponseDTO>> getAllDepartments() {
        return ResponseEntity.ok(departmentService.getAllDepartments());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Departman detayi getir", description = "Belirtilen ID'ye sahip departman bilgilerini dondurur.")
    public ResponseEntity<DepartmentResponseDTO> getDepartmentById(@PathVariable Long id) {
        return ResponseEntity.ok(departmentService.getDepartmentById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Yeni departman olustur (Sadece ADMIN)", description = "Sisteme yeni bir tibbi departman ekler.")
    public ResponseEntity<DepartmentResponseDTO> createDepartment(@Valid @RequestBody DepartmentRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(departmentService.createDepartment(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Departman guncelle (Sadece ADMIN)", description = "Var olan bir departmanin adini gunceller.")
    public ResponseEntity<DepartmentResponseDTO> updateDepartment(
            @PathVariable Long id,
            @Valid @RequestBody DepartmentRequestDTO request
    ) {
        return ResponseEntity.ok(departmentService.updateDepartment(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Departman sil (Sadece ADMIN)", description = "Belirtilen departmani sistemden kaldirir.")
    public ResponseEntity<ApiResponseDTO<Void>> deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.ok(ApiResponseDTO.success("Departman basariyla silindi."));
    }
}
