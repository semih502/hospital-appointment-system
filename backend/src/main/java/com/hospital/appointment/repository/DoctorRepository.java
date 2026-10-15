package com.hospital.appointment.repository;

import com.hospital.appointment.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Doktor veri erisim katmani. N+1 problemlerini onlemek icin JOIN FETCH sorgulari icerir.
 */
@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    /**
     * Kullanici ID'sine gore doktor kaydini getirir.
     */
    Optional<Doctor> findByUserId(Long userId);

    /**
     * Kullanicinin zaten bir doktor kaydi olup olmadigini kontrol eder.
     */
    boolean existsByUserId(Long userId);

    /**
     * Iliskili User ve Department nesnelerini tek sorguda getiren listeleyici.
     */
    @Query("SELECT d FROM Doctor d JOIN FETCH d.user JOIN FETCH d.department")
    List<Doctor> findAllWithDetails();

    /**
     * Belirli bir doktoru User ve Department ile birlikte eager yukler.
     */
    @Query("SELECT d FROM Doctor d JOIN FETCH d.user JOIN FETCH d.department WHERE d.id = :id")
    Optional<Doctor> findByIdWithDetails(@Param("id") Long id);

    /**
     * Belirli bir departmandaki doktorlari User ve Department detaylariyla getirir.
     */
    @Query("SELECT d FROM Doctor d JOIN FETCH d.user JOIN FETCH d.department WHERE d.department.id = :departmentId")
    List<Doctor> findByDepartmentIdWithDetails(@Param("departmentId") Long departmentId);
}
