package com.hospital.appointment.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Global Exception Handler tarafindan donulen standart JSON hata modeli.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(description = "Standart hata yanit modeli")
public class ErrorResponseDTO {

    @Builder.Default
    @Schema(description = "Hatanin gerceklestigi zaman damgasi")
    private LocalDateTime timestamp = LocalDateTime.now();

    @Schema(example = "400", description = "HTTP durum kodu")
    private int status;

    @Schema(example = "Bad Request", description = "HTTP durum aciklamasi")
    private String error;

    @Schema(example = "Gecersiz istek parametreleri", description = "Detayli hata mesaji")
    private String message;

    @Schema(example = "/api/auth/login", description = "Hatanin olustugu istek adresi")
    private String path;

    @Schema(description = "Validasyon hatalarini iceren alan-mesaj haritasi")
    private Map<String, String> validationErrors;
}
