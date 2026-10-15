package com.hospital.appointment.dto.request;

import com.hospital.appointment.entity.enums.AppointmentStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Randevu durumunu guncelleme istek modeli.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Randevu durumu guncelleme modeli")
public class AppointmentStatusUpdateDTO {

    @NotNull(message = "Yeni durum bos birakilamaz")
    @Schema(example = "CONFIRMED", description = "Yeni randevu durumu (PENDING, CONFIRMED, CANCELLED)")
    private AppointmentStatus status;
}
