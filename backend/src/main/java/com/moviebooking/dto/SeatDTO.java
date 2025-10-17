package com.moviebooking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeatDTO {
    private Long id;
    private String seatRow;
    private Integer seatNumber;
    private String seatType;
    private BigDecimal price;
    private Boolean isAvailable;
    private Boolean isBlocked;
    private String displayName; // e.g., "A1", "B5"
}