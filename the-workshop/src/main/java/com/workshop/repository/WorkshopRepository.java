package com.workshop.repository;

import com.workshop.entity.Workshop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkshopRepository extends JpaRepository<Workshop, Long> {
    List<Workshop> findByActiveTrue();

    @Query("SELECT w FROM Workshop w WHERE w.active = true ORDER BY w.scheduledAt ASC")
    List<Workshop> findAllActiveWorkshopsOrderBySchedule();
}