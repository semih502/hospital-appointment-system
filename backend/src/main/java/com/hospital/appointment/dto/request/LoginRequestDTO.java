package com.hospital.appointment.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Kullanici giris istegi icin veri transfer nesnesi (DTO).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Kullanici giris veri transfer modeli")
public class LoginRequestDTO {

    @NotBlank(message = "E-posta adresi bos birakilamaz")
    @Email(message = "Lutfen gecerli bir e-posta adresi giriniz")
    @Schema(example = "ahmet.yilmaz@hospital.com", description = "Kayitli kullanici e-posta adresi")
    private String email;

    @NotBlank(message = "Sifre bos birakilamaz")
    @Size(min = 6, message = "Sifre en az 6 karakter olmalidir")
    @Schema(example = "Password123!", description = "Kullanici sifresi")
    private String password;
}
