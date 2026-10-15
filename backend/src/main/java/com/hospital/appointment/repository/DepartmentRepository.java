package com.hospital.appointment.repository;

import com.hospital.appointment.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Departman veri erisim katmani.
 */
@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {

    /**
     * Departman ismine gore kayit arar.
     */
    Optional<Department> findByNameIgnoreCase(String name);

    /**
     * Departman isminin sistemde zaten kayitli olup olmadigini kontrol eder.
     */
    boolean existsByNameIgnoreCase(String name);
}
