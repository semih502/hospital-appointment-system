package com.hospital.appointment.controller;

import com.hospital.appointment.dto.request.LoginRequestDTO;
import com.hospital.appointment.dto.request.RegisterRequestDTO;
import com.hospital.appointment.dto.response.ApiResponseDTO;
import com.hospital.appointment.dto.response.JwtResponseDTO;
import com.hospital.appointment.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Kullanici kayit ve kimlik dogrulama islemlerini yoneten REST Controller.
 */
@RestController
@RequestMapping({"/api/auth", "/auth"})
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Kullanici kayit, giris ve JWT token islemleri")
public class AuthController {

    private final AuthService authService;

    /**
     * Kullanici giris uc noktasi.
     * Basarili giris durumunda JwtResponseDTO formatinda token ve profil bilgisi doner.
     */
    @PostMapping("/login")
    @Operation(summary = "Kullanici Girisi", description = "E-posta ve parola ile oturum acilip JWT belirteci elde edilir.")
    public ResponseEntity<JwtResponseDTO> login(@Valid @RequestBody LoginRequestDTO loginRequest) {
        JwtResponseDTO response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    /**
     * Yeni kullanici kayit uc noktasi.
     * Parola BCrypt ile hashlenerek kaydedilir ve DTO formatinda donus yapilir.
     */
    @PostMapping("/register")
    @Operation(summary = "Yeni Kullanici Kaydi", description = "Hasta, Doktor veya Yonetici hesabi olusturur.")
    public ResponseEntity<ApiResponseDTO<JwtResponseDTO>> register(@Valid @RequestBody RegisterRequestDTO registerRequest) {
        ApiResponseDTO<JwtResponseDTO> response = authService.register(registerRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
