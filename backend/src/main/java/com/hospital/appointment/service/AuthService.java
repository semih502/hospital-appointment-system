package com.hospital.appointment.service;

import com.hospital.appointment.dto.request.LoginRequestDTO;
import com.hospital.appointment.dto.request.RegisterRequestDTO;
import com.hospital.appointment.dto.response.ApiResponseDTO;
import com.hospital.appointment.dto.response.JwtResponseDTO;

/**
 * Kimlik dogrulama ve kullanici kayit islemlerini yuruten servis arayuzu.
 */
public interface AuthService {

    /**
     * Kullanici giris islemini gerceklestirir ve JWT token dondurur.
     *
     * @param request giris bilgileri (e-posta ve sifre)
     * @return JWT ve kullanici detaylarini iceren DTO
     */
    JwtResponseDTO login(LoginRequestDTO request);

    /**
     * Yeni kullanici kaydini olusturur ve veritabanina hashlenmis sifreyle kaydeder.
     *
     * @param request kayit form bilgileri
     * @return islem basari durumunu ve JWT token'i iceren yanit DTO'su
     */
    ApiResponseDTO<JwtResponseDTO> register(RegisterRequestDTO request);
}
