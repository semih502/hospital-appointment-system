package com.hospital.appointment.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Genel API operasyon yanitlarini kapsulleyen standart yanit DTO'su.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Standart API yanit modeli")
public class ApiResponseDTO<T> {

    @Schema(example = "true", description = "Islemin basari durumu")
    private boolean success;

    @Schema(example = "Islem basariyla tamamlandi.", description = "Kullaniciya veya istemciye gosterilecek mesaj")
    private String message;

    @Schema(description = "Istege bagli veri yukunu (payload) temsil eder")
    private T data;

    @Builder.Default
    @Schema(description = "Islemin tamamlandigi zaman damgasi")
    private LocalDateTime timestamp = LocalDateTime.now();

    public static <T> ApiResponseDTO<T> success(String message, T data) {
        return ApiResponseDTO.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static <T> ApiResponseDTO<T> success(String message) {
        return success(message, null);
    }
}
