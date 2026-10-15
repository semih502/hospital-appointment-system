package com.hospital.appointment.repository;

import com.hospital.appointment.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Kullanici veri erisim katmani.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * E-posta adresine gore kullanici arar.
     *
     * @param email aranacak e-posta adresi
     * @return bulunan kullanici nesnesi (Optional)
     */
    Optional<User> findByEmail(String email);

    /**
     * E-posta adresinin sistemde kayitli olup olmadigini kontrol eder.
     *
     * @param email kontrol edilecek e-posta adresi
     * @return kayitli ise true, degilse false
     */
    boolean existsByEmail(String email);
}
