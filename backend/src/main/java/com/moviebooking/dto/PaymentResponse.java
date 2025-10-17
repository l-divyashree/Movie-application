package com.moviebooking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    private Long id;
    private String paymentMethod;
    private BigDecimal amount;
    private String paymentStatus;
    private String transactionId;
    private String gatewayOrderId;
    private String gatewayPaymentId;
    private LocalDateTime paymentDate;
    private String failureReason;
    private String receipt;
}