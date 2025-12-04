package com.workshop.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegistrationRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Workshop ID is required")
    private Long workshopId;
}