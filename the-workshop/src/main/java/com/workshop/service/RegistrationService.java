package com.workshop.service;

import com.workshop.entity.Registration;
import com.workshop.entity.User;
import com.workshop.entity.Workshop;
import com.workshop.exception.ResourceNotFoundException;
import com.workshop.exception.WorkshopFullException;
import com.workshop.repository.RegistrationRepository;
import com.workshop.repository.UserRepository;
import com.workshop.repository.WorkshopRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final WorkshopRepository workshopRepository;
    private final UserRepository userRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    private static final String REDIS_SEAT_KEY = "workshop:%d:seats";

    /**
     * 🎫 ลงทะเบียน Workshop แบบ HIGH CONCURRENCY
     *
     * Logic:
     * 1. Redis DECR (Atomic) - ลดที่นั่ง 1 ที่
     * 2. ถ้าผลลัพธ์ >= 0 = สำเร็จ → บันทึกลง PostgreSQL
     * 3. ถ้าผลลัพธ์ < 0 = เต็ม → Redis INCR (Rollback) → Throw Exception
     */
    @Transactional
    public Registration registerForWorkshop(Long userId, Long workshopId) {
        // 1. ตรวจสอบว่า User และ Workshop มีอยู่จริง
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Workshop workshop = workshopRepository.findById(workshopId)
                .orElseThrow(() -> new ResourceNotFoundException("Workshop not found"));

        // 2. ตรวจสอบว่าลงทะเบียนแล้วหรือยัง
        if (registrationRepository.existsByUserIdAndWorkshopId(userId, workshopId)) {
            throw new RuntimeException("You have already registered for this workshop");
        }

        // 3. 🔥 Redis DECR (Atomic Operation) - ลดที่นั่ง
        String redisKey = String.format(REDIS_SEAT_KEY, workshopId);
        Long remainingSeats = redisTemplate.opsForValue().decrement(redisKey);

        log.info("🎫 Redis DECR - Workshop {}: {} seats remaining", workshopId, remainingSeats);

        // 4. ตรวจสอบผลลัพธ์
        if (remainingSeats == null || remainingSeats < 0) {
            // ที่นั่งเต็มแล้ว → Rollback (Redis INCR)
            redisTemplate.opsForValue().increment(redisKey);
            log.warn("❌ Workshop {} is FULL. Rollback executed.", workshopId);
            throw new WorkshopFullException("Workshop is full. Registration failed.");
        }

        // 5. บันทึกลง PostgreSQL
        Registration registration = Registration.builder()
                .user(user)
                .workshop(workshop)
                .status(Registration.RegistrationStatus.CONFIRMED)
                .build();

        Registration saved = registrationRepository.save(registration);
        log.info("✅ Registration successful - User {} registered for Workshop {}", userId, workshopId);

        return saved;
    }

    /**
     * ❌ ยกเลิกการลงทะเบียน
     *
     * Logic:
     * 1. ลบข้อมูลจาก PostgreSQL
     * 2. Redis INCR - คืนที่นั่ง 1 ที่
     */
    @Transactional
    public void cancelRegistration(Long userId, Long workshopId) {
        // 1. หา Registration
        Registration registration = registrationRepository.findByUserIdAndWorkshopId(userId, workshopId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found"));

        // 2. เปลี่ยนสถานะเป็น CANCELLED
        registration.setStatus(Registration.RegistrationStatus.CANCELLED);
        registrationRepository.save(registration);

        // 3. Redis INCR - คืนที่นั่ง
        String redisKey = String.format(REDIS_SEAT_KEY, workshopId);
        Long newSeats = redisTemplate.opsForValue().increment(redisKey);

        log.info("❌ Registration cancelled - User {}, Workshop {}. Seats now: {}", userId, workshopId, newSeats);
    }

    /**
     * 👤 ดูประวัติการลงทะเบียนของ User
     */
    @Transactional(readOnly = true)
    public List<Registration> getUserRegistrations(Long userId) {
        return registrationRepository.findByUserId(userId);
    }

    /**
     * 📊 ดูรายชื่อผู้ลงทะเบียนของ Workshop
     */
    @Transactional(readOnly = true)
    public List<Registration> getWorkshopRegistrations(Long workshopId) {
        return registrationRepository.findByWorkshopId(workshopId);
    }
}