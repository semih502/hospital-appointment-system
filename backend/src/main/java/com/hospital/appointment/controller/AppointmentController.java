package com.hospital.appointment.controller;

import com.hospital.appointment.dto.request.AppointmentRequestDTO;
import com.hospital.appointment.dto.request.AppointmentStatusUpdateDTO;
import com.hospital.appointment.dto.response.ApiResponseDTO;
import com.hospital.appointment.dto.response.AppointmentResponseDTO;
import com.hospital.appointment.security.CustomUserDetails;
import com.hospital.appointment.service.AppointmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Randevu islemlerini ve cakisik rezervasyon korumalarini yoneten REST Controller.
 */
@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
@Tag(name = "Appointment Management", description = "Randevu olusturma, takvim slotlari, durum guncelleme ve RBAC kontrolleri")
public class AppointmentController {

    private final AppointmentService appointmentService;

    /**
     * Yeni randevu olusturma uc noktasi.
     * Sadece PATIENT rolundeki kullanicilar olusturabilir ve SecurityContext uzerindeki kullanici ID'si baglanir.
     */
    @PostMapping
    @PreAuthorize("hasRole('PATIENT')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Yeni randevu al (Sadece PATIENT)", description = "Hasta icin randevu kaydeder. Ayni saat cakisik ise 409 Conflict doner.")
    public ResponseEntity<AppointmentResponseDTO> createAppointment(
            @Valid @RequestBody AppointmentRequestDTO request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        AppointmentResponseDTO response = appointmentService.createAppointment(request, userDetails.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Hastanin kendi randevularini listelemesi.
     */
    @GetMapping("/my")
    @PreAuthorize("hasRole('PATIENT')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Hastanin kendi randevulari (Sadece PATIENT)", description = "Oturum acan hastaya ait tum gecmis ve gelecek randevulari listeler.")
    public ResponseEntity<List<AppointmentResponseDTO>> getMyAppointmentsAsPatient(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(appointmentService.getMyAppointmentsAsPatient(userDetails.getId()));
    }

    /**
     * Doktorun kendi randevularini listelemesi.
     */
    @GetMapping("/doctor/my")
    @PreAuthorize("hasRole('DOCTOR')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Doktorun kendi randevulari (Sadece DOCTOR)", description = "Oturum acan doktora atanmis randevulari getirir.")
    public ResponseEntity<List<AppointmentResponseDTO>> getMyAppointmentsAsDoctor(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(appointmentService.getMyAppointmentsAsDoctor(userDetails.getId()));
    }

    /**
     * Tum randevulari listeleme (Sadece ADMIN).
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Sistemdeki tum randevulari listele (Sadece ADMIN)", description = "Yonetici paneli icin tum randevulari detaylariyla dondurur.")
    public ResponseEntity<List<AppointmentResponseDTO>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    /**
     * Randevu durumunu guncelleme (Onaylama / Iptal Etme).
     */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'PATIENT')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Randevu durumunu guncelle", description = "Doktor onaylayabilir/iptal edebilir, hasta yalnizca iptal edebilir, admin her durumu degistirebilir.")
    public ResponseEntity<AppointmentResponseDTO> updateAppointmentStatus(
            @PathVariable Long id,
            @Valid @RequestBody AppointmentStatusUpdateDTO statusDTO,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        AppointmentResponseDTO response = appointmentService.updateAppointmentStatus(
                id,
                statusDTO.getStatus(),
                userDetails.getId(),
                userDetails.getRole()
        );
        return ResponseEntity.ok(response);
    }

    /**
     * Frontend Takvim/Slot bileseni icin doktorun dolu saatlerini listeler.
     * Hasta gizliligini korumak icin sadece rezerve edilmis tarih/saat listesi doner.
     */
    @GetMapping("/doctor/{doctorId}/booked-slots")
    @Operation(summary = "Doktorun dolu randevu saatleri", description = "Takvimde unclickable yapilacak dolu saatleri listeler. Hasta bilgisi gizlidir.")
    public ResponseEntity<List<LocalDateTime>> getBookedSlotsForDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(appointmentService.getBookedSlotsForDoctor(doctorId));
    }

    /**
     * Randevuyu iptal etme kisayol ucu.
     */
    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'PATIENT')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Randevuyu iptal et", description = "Randevu durumunu CANCELLED olarak isaretler.")
    public ResponseEntity<ApiResponseDTO<Void>> cancelAppointment(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        appointmentService.cancelAppointment(id, userDetails.getId(), userDetails.getRole());
        return ResponseEntity.ok(ApiResponseDTO.success("Randevu basariyla iptal edildi."));
    }
}
