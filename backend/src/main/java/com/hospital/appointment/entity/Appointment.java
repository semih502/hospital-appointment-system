package com.hospital.appointment.entity;

import com.hospital.appointment.entity.enums.AppointmentStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * Randevu kayitlarini temsil eden entity sinifi.
 * Cift rezervasyon (double-booking) ve eszamanli erisim cakismalarini engellemek amaciyla
 * JPA Optimistic Locking (@Version) yapilandirilmistir.
 */
@Entity
@Table(
    name = "appointments",
    indexes = {
        @Index(name = "idx_doctor_date", columnList = "doctor_id, appointment_date"),
        @Index(name = "idx_patient_date", columnList = "patient_id, appointment_date")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private User patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @Column(name = "appointment_date", nullable = false)
    private LocalDateTime appointmentDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private AppointmentStatus status;

    /**
     * JPA Optimistic Locking versiyon alani.
     * Eszamanli guncelleme ve cakisik randevu olusturma durumlarinda
     * OptimisticLockException firlatarak veri tutarliligini saglar.
     */
    @Version
    @Column(name = "version")
    private Long version;
}
