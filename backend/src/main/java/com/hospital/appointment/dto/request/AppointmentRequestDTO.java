package com.hospital.appointment.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Yeni randevu olusturma istek modeli.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Randevu olusturma veri transfer modeli")
public class AppointmentRequestDTO {

    @NotNull(message = "Doktor secimi zorunludur")
    @Schema(example = "1", description = "Randevu alinacak doktorun ID'si")
    private Long doctorId;

    @NotNull(message = "Randevu tarihi ve saati bos birakilamaz")
    @Future(message = "Randevu tarihi gelecekte bir zaman dilimi olmalidir")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Schema(example = "2026-10-20T14:30:00", description = "Randevu alinmak istenen tarih ve saat (ISO-8601)")
    private LocalDateTime appointmentDate;
}
