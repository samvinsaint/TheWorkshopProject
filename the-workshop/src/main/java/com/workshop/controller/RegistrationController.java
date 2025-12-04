package com.workshop.controller;

import com.workshop.dto.ApiResponse;
import com.workshop.dto.RegistrationRequest;
import com.workshop.entity.Registration;
import com.workshop.service.RegistrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * 🎫 RegistrationController - จัดการการลงทะเบียน Workshop
 *
 * 🔥 CORE HIGH CONCURRENCY ENDPOINT 🔥
 *
 * Endpoints:
 * - POST /api/registrations - ลงทะเบียน Workshop (ใช้ Redis DECR)
 * - DELETE /api/registrations - ยกเลิกการลงทะเบียน (ใช้ Redis INCR)
 * - GET /api/registrations/user/{userId} - ดูประวัติการลงทะเบียนของ User
 * - GET /api/registrations/workshop/{workshopId} - ดูรายชื่อผู้ลงทะเบียนของ Workshop
 */
@RestController
@RequestMapping("/api/registrations")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class RegistrationController {

    private final RegistrationService registrationService;

    /**
     * 🎫 ลงทะเบียน Workshop
     * POST /api/registrations
     *
     * 🔥 HIGH CONCURRENCY LOGIC:
     * 1. Redis DECR workshop:{id}:seats (Atomic Operation)
     * 2. ถ้าผลลัพธ์ >= 0 = สำเร็จ → บันทึกลง PostgreSQL
     * 3. ถ้าผลลัพธ์ < 0 = เต็มแล้ว → Redis INCR (Rollback) → Throw Exception
     *
     * Body Example:
     * {
     *   "userId": 1,
     *   "workshopId": 1
     * }
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Registration>> registerForWorkshop(
            @Valid @RequestBody RegistrationRequest request) {

        log.info("🎫 POST /api/registrations - User {} registering for workshop {}",
                request.getUserId(), request.getWorkshopId());

        Registration registration = registrationService.registerForWorkshop(
                request.getUserId(),
                request.getWorkshopId()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.success("Registration successful! 🎉", registration)
        );
    }

    /**
     * ❌ ยกเลิกการลงทะเบียน
     * DELETE /api/registrations?userId={userId}&workshopId={workshopId}
     *
     * Logic:
     * 1. ลบข้อมูลจาก PostgreSQL
     * 2. Redis INCR workshop:{id}:seats (คืนที่นั่ง 1 ที่)
     */
    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> cancelRegistration(
            @RequestParam Long userId,
            @RequestParam Long workshopId) {

        log.info("❌ DELETE /api/registrations - User {} cancelling workshop {}",
                userId, workshopId);

        registrationService.cancelRegistration(userId, workshopId);

        return ResponseEntity.ok(
                ApiResponse.success("Registration cancelled successfully", null)
        );
    }

    /**
     * 👤 ดูประวัติการลงทะเบียนของ User
     * GET /api/registrations/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<Registration>>> getUserRegistrations(
            @PathVariable Long userId) {

        log.info("👤 GET /api/registrations/user/{} - Fetching user registrations", userId);

        List<Registration> registrations = registrationService.getUserRegistrations(userId);

        return ResponseEntity.ok(
                ApiResponse.success("User registrations retrieved", registrations)
        );
    }

    /**
     * 📊 ดูรายชื่อผู้ลงทะเบียนของ Workshop
     * GET /api/registrations/workshop/{workshopId}
     */
    @GetMapping("/workshop/{workshopId}")
    public ResponseEntity<ApiResponse<List<Registration>>> getWorkshopRegistrations(
            @PathVariable Long workshopId) {

        log.info("📊 GET /api/registrations/workshop/{} - Fetching workshop registrations", workshopId);

        List<Registration> registrations = registrationService.getWorkshopRegistrations(workshopId);

        return ResponseEntity.ok(
                ApiResponse.success("Workshop registrations retrieved", registrations)
        );
    }
}