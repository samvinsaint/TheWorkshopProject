package com.workshop.service;

import com.workshop.dto.WorkshopDTO;
import com.workshop.entity.Workshop;
import com.workshop.exception.ResourceNotFoundException;
import com.workshop.repository.WorkshopRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class WorkshopService {

    private final WorkshopRepository workshopRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    private static final String REDIS_SEAT_KEY = "workshop:%d:seats";

    /**
     * 📋 ดูรายการ Workshop ทั้งหมดที่เปิดใช้งาน
     */
    @Transactional(readOnly = true)
    public List<WorkshopDTO> getAllActiveWorkshops() {
        return workshopRepository.findAll().stream()
                .map(this::toWorkshopDTO)
                .collect(Collectors.toList());
    }

    /**
     * 🔍 ดู Workshop ตาม ID พร้อมจำนวนที่นั่งคงเหลือจาก Redis
     */
    @Transactional(readOnly = true)
    public WorkshopDTO getWorkshopById(Long id) {
        Workshop workshop = workshopRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workshop not found with id: " + id));

        return toWorkshopDTO(workshop);
    }

    /**
     * ➕ สร้าง Workshop ใหม่ และ Initialize Redis
     */
    @Transactional
    public WorkshopDTO createWorkshop(Workshop workshop) {
        // บันทึกลง PostgreSQL
        Workshop saved = workshopRepository.save(workshop);

        // Initialize Redis seat counter
        String redisKey = String.format(REDIS_SEAT_KEY, saved.getId());
        redisTemplate.opsForValue().set(redisKey, saved.getTotalSeats());

        log.info("✅ Workshop created: {} with {} seats in Redis", saved.getId(), saved.getTotalSeats());

        return toWorkshopDTO(saved);
    }

    /**
     * 🪑 เช็คจำนวนที่นั่งคงเหลือจาก Redis
     */
    public Integer getRemainingSeats(Long workshopId) {
        String redisKey = String.format(REDIS_SEAT_KEY, workshopId);
        Object seats = redisTemplate.opsForValue().get(redisKey);

        if (seats == null) {
            // ถ้า Redis ยังไม่มี ให้ดึงจาก DB แล้ว initialize
            Workshop workshop = workshopRepository.findById(workshopId)
                    .orElseThrow(() -> new ResourceNotFoundException("Workshop not found"));

            redisTemplate.opsForValue().set(redisKey, workshop.getTotalSeats());
            return workshop.getTotalSeats();
        }

        return Integer.parseInt(seats.toString());
    }

    /**
     * 🔄 แปลง Workshop Entity เป็น WorkshopDTO พร้อมดึงที่นั่งจาก Redis
     */
    private WorkshopDTO toWorkshopDTO(Workshop workshop) {
        Integer remainingSeats = getRemainingSeats(workshop.getId());

        return WorkshopDTO.builder()
                .id(workshop.getId())
                .title(workshop.getTitle())
                .description(workshop.getDescription())
                .totalSeats(workshop.getTotalSeats())
                .remainingSeats(remainingSeats)
                .price(workshop.getPrice())
                .scheduledAt(workshop.getScheduledAt())
                .createdAt(workshop.getCreatedAt())
                .build();
    }
}