package com.moviebooking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {
    
    @NotBlank(message = "Payment method is required")
    private String paymentMethod; // CREDIT_CARD, DEBIT_CARD, UPI, WALLET, etc.
    
    @NotNull(message = "Amount is required")
    private BigDecimal amount;
    
    // For card payments
    private String cardNumber;
    private String cardHolderName;
    private String expiryMonth;
    private String expiryYear;
    private String cvv;
    
    // For UPI payments
    private String upiId;
    
    // For wallet payments
    private String walletType;
    private String walletPhone;
    
    // For net banking
    private String bankCode;
    
    // Payment gateway specific
    private String transactionId;
    private String gatewayOrderId;
}