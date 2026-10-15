package com.hospital.appointment.service.impl;

import com.hospital.appointment.dto.request.AppointmentRequestDTO;
import com.hospital.appointment.dto.response.AppointmentResponseDTO;
import com.hospital.appointment.entity.Appointment;
import com.hospital.appointment.entity.Doctor;
import com.hospital.appointment.entity.User;
import com.hospital.appointment.entity.enums.AppointmentStatus;
import com.hospital.appointment.entity.enums.Role;
import com.hospital.appointment.exception.AppointmentConflictException;
import com.hospital.appointment.exception.ResourceNotFoundException;
import com.hospital.appointment.mapper.AppointmentMapper;
import com.hospital.appointment.repository.AppointmentRepository;
import com.hospital.appointment.repository.DoctorRepository;
import com.hospital.appointment.repository.UserRepository;
import com.hospital.appointment.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Randevu is mantigi ve cift rezervasyon (double-booking) onleme servisi.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final AppointmentMapper appointmentMapper;

    private static final List<AppointmentStatus> ACTIVE_STATUSES = List.of(
            AppointmentStatus.PENDING,
            AppointmentStatus.CONFIRMED
    );

    @Override
    @Transactional
    public AppointmentResponseDTO createAppointment(AppointmentRequestDTO request, Long patientUserId) {
        log.info("Randevu talebi alindi: HastaID={}, DoktorID={}, Tarih={}",
                patientUserId, request.getDoctorId(), request.getAppointmentDate());

        User patient = userRepository.findById(patientUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Hasta kullanicisi bulunamadi. ID: " + patientUserId));

        Doctor doctor = doctorRepository.findByIdWithDetails(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doktor bulunamadi. ID: " + request.getDoctorId()));

        // 1. KONTROL: Doktorun ayni saatte onaylanmis veya bekleyen randevusu var mi?
        boolean doctorHasConflict = appointmentRepository.existsByDoctorIdAndAppointmentDateAndStatusIn(
                doctor.getId(),
                request.getAppointmentDate(),
                ACTIVE_STATUSES
        );

        if (doctorHasConflict) {
            throw new AppointmentConflictException(
                    "Secilen doktorun belirtilen saatte (" + request.getAppointmentDate() + ") zaten bir randevusu bulunmaktadir. Lutfen baska bir saat seciniz."
            );
        }

        // 2. KONTROL: Hastanin ayni saat diliminde cakisik baska bir randevusu var mi?
        boolean patientHasConflict = appointmentRepository.existsByPatientIdAndAppointmentDateAndStatusIn(
                patient.getId(),
                request.getAppointmentDate(),
                ACTIVE_STATUSES
        );

        if (patientHasConflict) {
            throw new AppointmentConflictException(
                    "Ayni saat diliminde (" + request.getAppointmentDate() + ") baska bir randevunuz bulunmaktadir."
            );
        }

        // Randevu olusturma (Varsayilan durum: PENDING)
        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .appointmentDate(request.getAppointmentDate())
                .status(AppointmentStatus.PENDING)
                .build();

        Appointment savedAppointment = appointmentRepository.save(appointment);
        log.info("Randevu basariyla kaydedildi: ID={}, Hasta={}, Doktor={}, Versiyon={}",
                savedAppointment.getId(), patient.getName(), doctor.getUser().getName(), savedAppointment.getVersion());

        return appointmentMapper.toDTO(savedAppointment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentResponseDTO> getMyAppointmentsAsPatient(Long patientUserId) {
        return appointmentRepository.findByPatientIdWithDetails(patientUserId)
                .stream()
                .map(appointmentMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentResponseDTO> getMyAppointmentsAsDoctor(Long doctorUserId) {
        Doctor doctor = doctorRepository.findByUserId(doctorUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Giris yapan kullaniciya ait doktor profili bulunamadi."));

        return appointmentRepository.findByDoctorIdWithDetails(doctor.getId())
                .stream()
                .map(appointmentMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentResponseDTO> getAllAppointments() {
        return appointmentRepository.findAllWithDetails()
                .stream()
                .map(appointmentMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional
    public AppointmentResponseDTO updateAppointmentStatus(
            Long appointmentId,
            AppointmentStatus newStatus,
            Long currentUserId,
            Role currentUserRole
    ) {
        Appointment appointment = appointmentRepository.findByIdWithDetails(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Randevu bulunamadi. ID: " + appointmentId));

        // RBAC Yetki Kontrolu
        if (currentUserRole == Role.ADMIN) {
            // Admin her turlu durumu guncelleyebilir
        } else if (currentUserRole == Role.DOCTOR) {
            // Doktor sadece kendi randevusunu guncelleyebilir
            if (!appointment.getDoctor().getUser().getId().equals(currentUserId)) {
                throw new AccessDeniedException("Yalnizca kendi randevularinizin durumunu guncelleyebilirsiniz.");
            }
        } else if (currentUserRole == Role.PATIENT) {
            // Hasta sadece kendi randevusunu iptal edebilir
            if (!appointment.getPatient().getId().equals(currentUserId)) {
                throw new AccessDeniedException("Yalnizca kendi randevunuzu yonetebilirsiniz.");
            }
            if (newStatus != AppointmentStatus.CANCELLED) {
                throw new AccessDeniedException("Hastalar randevuyu yalnizca iptal edebilir.");
            }
        } else {
            throw new AccessDeniedException("Bu islem icin yetkiniz bulunmamaktadir.");
        }

        appointment.setStatus(newStatus);
        Appointment updated = appointmentRepository.save(appointment);
        log.info("Randevu durumu guncellendi: ID={}, YeniDurum={}, Versiyon={}",
                updated.getId(), updated.getStatus(), updated.getVersion());

        return appointmentMapper.toDTO(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LocalDateTime> getBookedSlotsForDoctor(Long doctorId) {
        if (!doctorRepository.existsById(doctorId)) {
            throw new ResourceNotFoundException("Doktor bulunamadi. ID: " + doctorId);
        }

        // Sadece rezerve edilmis (bekleyen veya onaylanan) randevularin tarihleri alinir
        List<Appointment> bookedAppointments = appointmentRepository.findByDoctorIdAndStatusIn(
                doctorId,
                ACTIVE_STATUSES
        );

        // Hasta gizliligini korumak icin yalnizca tarih ve saat bilgisi dondurulur
        return bookedAppointments.stream()
                .map(Appointment::getAppointmentDate)
                .sorted()
                .toList();
    }

    @Override
    @Transactional
    public void cancelAppointment(Long appointmentId, Long currentUserId, Role currentUserRole) {
        updateAppointmentStatus(appointmentId, AppointmentStatus.CANCELLED, currentUserId, currentUserRole);
    }
}
