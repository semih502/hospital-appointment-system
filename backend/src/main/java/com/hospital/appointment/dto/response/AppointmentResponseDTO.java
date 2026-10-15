package com.hospital.appointment.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.hospital.appointment.entity.enums.AppointmentStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Randevu detaylarini donduren yanit modeli.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Randevu yanit veri transfer modeli")
public class AppointmentResponseDTO {

    @Schema(example = "101", description = "Randevu benzersiz numarasi")
    private Long id;

    @Schema(example = "12", description = "Hasta ID")
    private Long patientId;

    @Schema(example = "Ali Yildiz", description = "Hasta tam adi")
    private String patientName;

    @Schema(example = "ali.yildiz@gmail.com", description = "Hasta e-posta adresi")
    private String patientEmail;

    @Schema(example = "3", description = "Doktor ID")
    private Long doctorId;

    @Schema(example = "Dr. Ayse Kaya", description = "Doktor tam adi")
    private String doctorName;

    @Schema(example = "Kardiyoloji", description = "Departman adi")
    private String departmentName;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Schema(example = "2026-10-20T14:30:00", description = "Randevu tarihi ve saati")
    private LocalDateTime appointmentDate;

    @Schema(example = "PENDING", description = "Randevu guncel durumu")
    private AppointmentStatus status;

    @Schema(example = "0", description = "JPA Optimistic Lock versiyon numarasi")
    private Long version;

    @Schema(description = "Randevunun olusturuldugu zaman damgasi")
    private LocalDateTime createdAt;
}
