package com.moviebooking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShowDTO {
    private Long id;
    private MovieDTO movie;
    private VenueDTO venue;
    private LocalDate showDate;
    private LocalTime showTime;
    private String screenName;
    private BigDecimal price;
    private Integer availableSeats;
    private Integer totalSeats;
    private List<SeatDTO> seats;
}