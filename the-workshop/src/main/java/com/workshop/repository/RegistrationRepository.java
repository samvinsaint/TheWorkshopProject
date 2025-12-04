package com.workshop.repository;

import com.workshop.entity.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    boolean existsByUserIdAndWorkshopId(Long userId, Long workshopId);

    long countByWorkshopIdAndStatus(Long workshopId, Registration.RegistrationStatus status);

    Optional<Registration> findByUserIdAndWorkshopId(Long userId, Long workshopId);

    List<Registration> findByUserIdAndStatus(Long userId, Registration.RegistrationStatus status);

    List<Registration> findByUserId(Long userId);

    List<Registration> findByWorkshopId(Long workshopId); // เพิ่มบรรทัดนี้
}