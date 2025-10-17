package com.moviebooking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private Long id;
    private String bookingReference;
    private ShowDTO show;
    private List<SeatDTO> seats;
    private BigDecimal totalAmount;
    private String bookingStatus;
    private String paymentStatus;
    private LocalDateTime bookingDate;
    private String qrCode;
    private PaymentResponse paymentDetails;
    private String specialRequests;
    private Boolean canCancel;
    private LocalDateTime cancellationDeadline;
}