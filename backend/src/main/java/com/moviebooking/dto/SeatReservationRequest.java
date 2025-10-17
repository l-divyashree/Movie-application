package com.moviebooking.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeatReservationRequest {
    
    @NotNull(message = "Show ID is required")
    private Long showId;
    
    @NotNull(message = "Seat IDs are required")
    private List<Long> seatIds;
    
    @Builder.Default
    private Integer reservationTimeMinutes = 10; // How long to hold the seats
}