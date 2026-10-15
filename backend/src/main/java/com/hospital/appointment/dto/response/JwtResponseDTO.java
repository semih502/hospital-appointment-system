package com.hospital.appointment.dto.response;

import com.hospital.appointment.entity.enums.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Basarili giris sonrasi dondurulen JWT ve kullanici profili yanit DTO'su.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "JWT kimlik dogrulama yanit modeli")
public class JwtResponseDTO {

    @Schema(description = "JWT erisim token'i")
    private String token;

    @Builder.Default
    @Schema(example = "Bearer", description = "Belirtec tipi")
    private String type = "Bearer";

    @Schema(example = "1", description = "Kullanici kimlik numarasi (ID)")
    private Long id;

    @Schema(example = "Ahmet Yilmaz", description = "Kullanici adi")
    private String name;

    @Schema(example = "ahmet.yilmaz@hospital.com", description = "Kullanici e-posta adresi")
    private String email;

    @Schema(example = "PATIENT", description = "Kullanici yetki rolu")
    private Role role;
}
