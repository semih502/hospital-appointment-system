package com.hospital.appointment.dto.request;

import com.hospital.appointment.entity.enums.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Yeni kullanici kayit istegi icin veri transfer nesnesi (DTO).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Kullanici kayit veri transfer modeli")
public class RegisterRequestDTO {

    @NotBlank(message = "Isim ve soyisim alani bos birakilamaz")
    @Size(min = 2, max = 100, message = "Isim 2 ile 100 karakter arasinda olmalidir")
    @Schema(example = "Ahmet Yilmaz", description = "Kullanicinin tam adi")
    private String name;

    @NotBlank(message = "E-posta adresi bos birakilamaz")
    @Email(message = "Lutfen gecerli bir e-posta adresi giriniz")
    @Schema(example = "ahmet.yilmaz@hospital.com", description = "Kullanici e-posta adresi")
    private String email;

    @NotBlank(message = "Sifre bos birakilamaz")
    @Size(min = 6, max = 50, message = "Sifre en az 6, en fazla 50 karakter olmalidir")
    @Schema(example = "Password123!", description = "Guvenli kullanici sifresi")
    private String password;

    @Schema(example = "PATIENT", description = "Kullanici rolu (Varsayilan: PATIENT)")
    private Role role;
}
