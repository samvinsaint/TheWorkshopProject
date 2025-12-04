package com.workshop.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkshopDTO {
    private Long id;
    private String title;
    private String description;
    private Integer totalSeats;
    private Integer remainingSeats; // จาก Redis
    private Double price;
    private LocalDateTime scheduledAt;
    private LocalDateTime createdAt;
}