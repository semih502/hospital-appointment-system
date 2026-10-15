package com.hospital.appointment.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * JWT (JSON Web Token) uretim, cozumleme ve dogrulama islemlerini yoneten yardimci bilesen.
 */
@Slf4j
@Component
public class JwtUtils {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration-ms:86400000}")
    private long jwtExpirationMs;

    /**
     * Kimligi dogrulanmis kullanici icin JWT token uretir.
     *
     * @param authentication Spring Security kimlik dogrulama nesnesi
     * @return uretilen JWT token dizgesi
     */
    public String generateJwtToken(Authentication authentication) {
        CustomUserDetails userPrincipal = (CustomUserDetails) authentication.getPrincipal();

        return Jwts.builder()
                .subject(userPrincipal.getUsername())
                .claim("id", userPrincipal.getId())
                .claim("name", userPrincipal.getName())
                .claim("role", userPrincipal.getRole().name())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * Dogrudan parametreler ile JWT token uretir (ornek: kayit sonrasi veya ozel akislar icin).
     */
    public String generateTokenFromEmailAndRole(String email, Long id, String name, String role) {
        return Jwts.builder()
                .subject(email)
                .claim("id", id)
                .claim("name", name)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * Token icerisinden kullanici e-posta adresini (subject) cozumler.
     *
     * @param token cozumlenecek JWT token
     * @return kullanici e-posta adresi
     */
    public String extractEmail(String token) {
        return getClaims(token).getSubject();
    }

    /**
     * Token'in gecerliligini, suresinin dolup dolmadigini ve imzasini dogrular.
     *
     * @param authToken kontrol edilecek JWT token
     * @return token gecerli ise true, aksi halde false
     */
    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(authToken);
            return true;
        } catch (ExpiredJwtException e) {
            log.error("JWT token suresi dolmus: {}", e.getMessage());
        } catch (JwtException e) {
            log.error("Gecersiz JWT token: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.error("JWT token bos veya hatali: {}", e.getMessage());
        }
        return false;
    }

    /**
     * Token payload kismini (Claims) dondurur.
     */
    public Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Konfigurasyondaki secret anahtari SecretKey nesnesine donusturur.
     */
    private SecretKey getSigningKey() {
        byte[] keyBytes;
        try {
            keyBytes = Decoders.BASE64.decode(jwtSecret);
        } catch (Exception e) {
            keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
