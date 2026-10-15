package com.hospital.appointment.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Departman ekleme/guncelleme istek modeli.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Departman istek veri transfer modeli")
public class DepartmentRequestDTO {

    @NotBlank(message = "Departman adi bos birakilamaz")
    @Size(min = 2, max = 100, message = "Departman adi 2 ile 100 karakter arasinda olmalidir")
    @Schema(example = "Kardiyoloji", description = "Departmanin benzersiz adi")
    private String name;
}
