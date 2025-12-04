package com.workshop.controller;

import com.workshop.dto.ApiResponse;
import com.workshop.dto.WorkshopDTO;
import com.workshop.entity.Workshop;
import com.workshop.service.WorkshopService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * 📋 WorkshopController - จัดการ Workshop CRUD operations
 *
 * Endpoints:
 * - GET /api/workshops - ดูรายการ workshop ทั้งหมด
 * - GET /api/workshops/{id} - ดู workshop ตาม ID
 * - POST /api/workshops - สร้าง workshop ใหม่
 * - GET /api/workshops/{id}/seats - เช็คที่นั่งคงเหลือ
 */
@RestController
@RequestMapping("/api/workshops")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*") // อนุญาตให้ Frontend เรียกใช้ได้
public class WorkshopController {

    private final WorkshopService workshopService;

    /**
     * 📋 ดูรายการ Workshop ทั้งหมดที่เปิดใช้งาน
     * GET /api/workshops
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<WorkshopDTO>>> getAllWorkshops() {
        log.info("📋 GET /api/workshops - Fetching all active workshops");
        List<WorkshopDTO> workshops = workshopService.getAllActiveWorkshops();
        return ResponseEntity.ok(
                ApiResponse.success("Workshops retrieved successfully", workshops)
        );
    }

    /**
     * 🔍 ดู Workshop ตาม ID พร้อมจำนวนที่นั่งคงเหลือแบบ Real-time
     * GET /api/workshops/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<WorkshopDTO>> getWorkshopById(@PathVariable Long id) {
        log.info("🔍 GET /api/workshops/{} - Fetching workshop details", id);
        WorkshopDTO workshop = workshopService.getWorkshopById(id);
        return ResponseEntity.ok(
                ApiResponse.success("Workshop found", workshop)
        );
    }

    /**
     * ➕ สร้าง Workshop ใหม่
     * POST /api/workshops
     *
     * Body Example:
     * {
     *   "title": "Spring Boot Masterclass",
     *   "description": "Learn Spring Boot from scratch",
     *   "totalSeats": 50,
     *   "price": 1500.00,
     *   "scheduledAt": "2024-12-25T10:00:00"
     * }
     */
    @PostMapping
    public ResponseEntity<ApiResponse<WorkshopDTO>> createWorkshop(@RequestBody Workshop workshop) {
        log.info("➕ POST /api/workshops - Creating new workshop: {}", workshop.getTitle());
        WorkshopDTO created = workshopService.createWorkshop(workshop);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.success("Workshop created successfully", created)
        );
    }

    /**
     * 🪑 เช็คจำนวนที่นั่งคงเหลือจาก Redis (Real-time)
     * GET /api/workshops/{id}/seats
     */
    @GetMapping("/{id}/seats")
    public ResponseEntity<ApiResponse<Integer>> getRemainingSeats(@PathVariable Long id) {
        log.info("🪑 GET /api/workshops/{}/seats - Checking remaining seats", id);
        Integer remainingSeats = workshopService.getRemainingSeats(id);
        return ResponseEntity.ok(
                ApiResponse.success("Remaining seats retrieved", remainingSeats)
        );
    }
}