package com.workshop.repository;

import com.workshop.entity.Registration;
import com.workshop.entity.Registration.RegistrationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    Optional<Registration> findByUserIdAndWorkshopId(Long userId, Long workshopId);
    List<Registration> findByUserId(Long userId);
    List<Registration> findByWorkshopId(Long workshopId);
    
    @Query("SELECT COUNT(r) FROM Registration r WHERE r.workshop.id = :workshopId AND r.status = :status")
    long countByWorkshopIdAndStatus(@Param("workshopId") Long workshopId, @Param("status") RegistrationStatus status);
    
    Boolean existsByUserIdAndWorkshopId(Long userId, Long workshopId);
}
