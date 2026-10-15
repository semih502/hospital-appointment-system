package com.hospital.appointment.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Departman yanit modeli.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Departman yanit veri transfer modeli")
public class DepartmentResponseDTO {

    @Schema(example = "1", description = "Departman ID")
    private Long id;

    @Schema(example = "Kardiyoloji", description = "Departman adi")
    private String name;

    @Schema(example = "4", description = "Departmana bagli doktor sayisi")
    private int doctorCount;

    @Schema(description = "Olusturulma tarihi")
    private LocalDateTime createdAt;
}
