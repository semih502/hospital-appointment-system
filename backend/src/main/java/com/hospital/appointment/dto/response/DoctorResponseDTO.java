package com.hospital.appointment.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Doktor profil ve departman bilgilerini donduren yanit modeli.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Doktor yanit veri transfer modeli")
public class DoctorResponseDTO {

    @Schema(example = "1", description = "Doktor profil ID'si")
    private Long id;

    @Schema(example = "5", description = "Kullanici (User) ID'si")
    private Long userId;

    @Schema(example = "Dr. Mehmet Oz", description = "Doktor adi")
    private String name;

    @Schema(example = "mehmet.oz@hospital.com", description = "Doktor e-posta adresi")
    private String email;

    @Schema(example = "2", description = "Bagli oldugu departman ID'si")
    private Long departmentId;

    @Schema(example = "Kardiyoloji", description = "Departman adi")
    private String departmentName;
}
