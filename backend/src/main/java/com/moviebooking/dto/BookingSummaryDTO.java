package com.moviebooking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingSummaryDTO {
    private ShowDTO show;
    private List<SeatDTO> selectedSeats;
    private BigDecimal subtotal;
    private BigDecimal taxes;
    private BigDecimal convenienceFee;
    private BigDecimal discount;
    private BigDecimal totalAmount;
    private String promoCode;
    private Integer totalTickets;
}