package com.hospital.appointment.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Doktor tanimlama / atama istek modeli.
 * Mevcut bir kullanici ID'si uzerinden atanabilir veya yeni kullanici bilgileriyle olusturulabilir.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Doktor olusturma / atama istek modeli")
public class DoctorRequestDTO {

    @Schema(example = "3", description = "Mevcut kullanici ID'si (Opsiyonel: Eger var olan kullanici doktora donusturulecekse)")
    private Long userId;

    @Schema(example = "Dr. Mehmet Oz", description = "Doktorun tam adi (userId belirtilmemisse zorunlu)")
    private String name;

    @Schema(example = "mehmet.oz@hospital.com", description = "Doktorun e-posta adresi (userId belirtilmemisse zorunlu)")
    private String email;

    @Schema(example = "DoctorPass123!", description = "Doktor hesabi sifresi (userId belirtilmemisse zorunlu)")
    private String password;

    @NotNull(message = "Departman ID bos birakilamaz")
    @Schema(example = "1", description = "Doktorun bagli oldugu departman ID'si")
    private Long departmentId;
}
