package com.hospital.appointment.service.impl;

import com.hospital.appointment.dto.request.LoginRequestDTO;
import com.hospital.appointment.dto.request.RegisterRequestDTO;
import com.hospital.appointment.dto.response.ApiResponseDTO;
import com.hospital.appointment.dto.response.JwtResponseDTO;
import com.hospital.appointment.entity.User;
import com.hospital.appointment.entity.enums.Role;
import com.hospital.appointment.exception.UserAlreadyExistsException;
import com.hospital.appointment.repository.UserRepository;
import com.hospital.appointment.security.CustomUserDetails;
import com.hospital.appointment.security.JwtUtils;
import com.hospital.appointment.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Kimlik dogrulama ve kayit islemlerinin is mantigi (Service layer).
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Override
    @Transactional(readOnly = true)
    public JwtResponseDTO login(LoginRequestDTO request) {
        log.info("Kullanici giris denemesi: {}", request.getEmail());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        return JwtResponseDTO.builder()
                .token(jwt)
                .type("Bearer")
                .id(userDetails.getId())
                .name(userDetails.getName())
                .email(userDetails.getEmail())
                .role(userDetails.getRole())
                .build();
    }

    @Override
    @Transactional
    public ApiResponseDTO<JwtResponseDTO> register(RegisterRequestDTO request) {
        log.info("Yeni kullanici kayit talebi: {}", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Bu e-posta adresiyle kayitli bir hesap zaten mevcut: " + request.getEmail());
        }

        Role assignedRole = request.getRole() != null ? request.getRole() : Role.PATIENT;

        User user = User.builder()
                .name(request.getName().trim())
                .email(request.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(assignedRole)
                .build();

        User savedUser = userRepository.save(user);
        log.info("Yeni kullanici basariyla kaydedildi. ID={}, Email={}, Rol={}", savedUser.getId(), savedUser.getEmail(), savedUser.getRole());

        // Kayit sonrasi otomatik JWT uretimi (Kullanici deneyimini artirmak icin)
        String jwt = jwtUtils.generateTokenFromEmailAndRole(
                savedUser.getEmail(),
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getRole().name()
        );

        JwtResponseDTO jwtResponse = JwtResponseDTO.builder()
                .token(jwt)
                .type("Bearer")
                .id(savedUser.getId())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .build();

        return ApiResponseDTO.success("Kullanici kaydi basariyla tamamlandi.", jwtResponse);
    }
}
