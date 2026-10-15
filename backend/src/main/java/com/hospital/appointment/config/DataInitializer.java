package com.hospital.appointment.config;

import com.hospital.appointment.entity.Department;
import com.hospital.appointment.entity.Doctor;
import com.hospital.appointment.entity.User;
import com.hospital.appointment.entity.enums.Role;
import com.hospital.appointment.repository.DepartmentRepository;
import com.hospital.appointment.repository.DoctorRepository;
import com.hospital.appointment.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Gelistirme ve ilk calistirma ortaminda ornek baslangic verilerini (Seed Data) olusturan bilesen.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Veritabaninda kullanicilar mevcut, tohumlama (seeding) atlandi.");
            return;
        }

        log.info("Baslangic tohum verileri olusturuluyor...");

        // 1. Admin Kullanicisi
        User admin = User.builder()
                .name("Sistem Yoneticisi")
                .email("admin@hospital.com")
                .password(passwordEncoder.encode("Admin123!"))
                .role(Role.ADMIN)
                .build();
        userRepository.save(admin);

        // 2. Departmanlar
        Department cardiology = Department.builder().name("Kardiyoloji").build();
        Department neurology = Department.builder().name("Nöroloji").build();
        Department pediatrics = Department.builder().name("Çocuk Sağlığı ve Hastalıkları").build();
        Department orthopedics = Department.builder().name("Ortopedi ve Travmatoloji").build();

        departmentRepository.saveAll(List.of(cardiology, neurology, pediatrics, orthopedics));

        // 3. Doktor Kullanicilari ve Profilleri
        User docUser1 = User.builder()
                .name("Prof. Dr. Mehmet Öz")
                .email("mehmet.oz@hospital.com")
                .password(passwordEncoder.encode("Doctor123!"))
                .role(Role.DOCTOR)
                .build();
        userRepository.save(docUser1);

        Doctor doc1 = Doctor.builder()
                .user(docUser1)
                .department(cardiology)
                .build();
        doctorRepository.save(doc1);

        User docUser2 = User.builder()
                .name("Doç. Dr. Ayşe Kaya")
                .email("ayse.kaya@hospital.com")
                .password(passwordEncoder.encode("Doctor123!"))
                .role(Role.DOCTOR)
                .build();
        userRepository.save(docUser2);

        Doctor doc2 = Doctor.builder()
                .user(docUser2)
                .department(neurology)
                .build();
        doctorRepository.save(doc2);

        User docUser3 = User.builder()
                .name("Uzm. Dr. Can Demir")
                .email("can.demir@hospital.com")
                .password(passwordEncoder.encode("Doctor123!"))
                .role(Role.DOCTOR)
                .build();
        userRepository.save(docUser3);

        Doctor doc3 = Doctor.builder()
                .user(docUser3)
                .department(pediatrics)
                .build();
        doctorRepository.save(doc3);

        // 4. Ornek Hasta Kullanicisi
        User patient = User.builder()
                .name("Ahmet Yılmaz")
                .email("ahmet.yilmaz@hospital.com")
                .password(passwordEncoder.encode("Patient123!"))
                .role(Role.PATIENT)
                .build();
        userRepository.save(patient);

        log.info("Baslangic tohum verileri basariyla yuklendi:");
        log.info(" - Admin: admin@hospital.com / Admin123!");
        log.info(" - Doktor 1 (Kardiyoloji): mehmet.oz@hospital.com / Doctor123!");
        log.info(" - Doktor 2 (Nöroloji): ayse.kaya@hospital.com / Doctor123!");
        log.info(" - Doktor 3 (Çocuk): can.demir@hospital.com / Doctor123!");
        log.info(" - Hasta: ahmet.yilmaz@hospital.com / Patient123!");
    }
}
