package com.moviebooking.service;

import com.moviebooking.dto.PaymentRequest;
import com.moviebooking.dto.PaymentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    /**
     * Process payment - This is a mock implementation
     * In real implementation, this would integrate with payment gateways like Razorpay, Stripe, etc.
     */
    public PaymentResponse processPayment(PaymentRequest paymentRequest) {
        try {
            // Validate payment details
            if (!validatePaymentDetails(paymentRequest)) {
                return PaymentResponse.builder()
                        .paymentMethod(paymentRequest.getPaymentMethod())
                        .amount(paymentRequest.getAmount())
                        .paymentStatus("FAILED")
                        .failureReason("Invalid payment details")
                        .paymentDate(LocalDateTime.now())
                        .build();
            }

            // Mock payment processing delay
            Thread.sleep(1000);

            // Generate mock transaction IDs
            String transactionId = "TXN_" + System.currentTimeMillis();
            String gatewayOrderId = "ORDER_" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            String gatewayPaymentId = "PAY_" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

            // For demo purposes, simulate payment success 90% of the time
            boolean paymentSuccess = Math.random() < 0.9;

            if (paymentSuccess) {
                return PaymentResponse.builder()
                        .paymentMethod(paymentRequest.getPaymentMethod())
                        .amount(paymentRequest.getAmount())
                        .paymentStatus("SUCCESS")
                        .transactionId(transactionId)
                        .gatewayOrderId(gatewayOrderId)
                        .gatewayPaymentId(gatewayPaymentId)
                        .paymentDate(LocalDateTime.now())
                        .receipt("Receipt: " + transactionId)
                        .build();
            } else {
                return PaymentResponse.builder()
                        .paymentMethod(paymentRequest.getPaymentMethod())
                        .amount(paymentRequest.getAmount())
                        .paymentStatus("FAILED")
                        .transactionId(transactionId)
                        .gatewayOrderId(gatewayOrderId)
                        .failureReason("Payment declined by bank")
                        .paymentDate(LocalDateTime.now())
                        .build();
            }

        } catch (Exception e) {
            return PaymentResponse.builder()
                    .paymentMethod(paymentRequest.getPaymentMethod())
                    .amount(paymentRequest.getAmount())
                    .paymentStatus("FAILED")
                    .failureReason("Payment processing error: " + e.getMessage())
                    .paymentDate(LocalDateTime.now())
                    .build();
        }
    }

    /**
     * Process payment for an existing booking
     */
    public PaymentResponse processPaymentForBooking(Long bookingId, PaymentRequest paymentRequest, Long userId) {
        // Add booking ID to the payment request for tracking
        PaymentResponse response = processPayment(paymentRequest);
        
        // In a real implementation, you would update the booking payment status here
        // bookingService.updatePaymentStatus(bookingId, response.getPaymentStatus(), response.getTransactionId());
        
        return response;
    }

    /**
     * Validate payment details
     */
    public boolean validatePaymentDetails(PaymentRequest paymentRequest) {
        if (paymentRequest.getPaymentMethod() == null || paymentRequest.getAmount() == null) {
            return false;
        }

        switch (paymentRequest.getPaymentMethod().toUpperCase()) {
            case "CREDIT_CARD":
            case "DEBIT_CARD":
                return validateCardDetails(paymentRequest);
            case "UPI":
                return validateUpiDetails(paymentRequest);
            case "WALLET":
                return validateWalletDetails(paymentRequest);
            case "NET_BANKING":
                return validateNetBankingDetails(paymentRequest);
            default:
                return false;
        }
    }

    private boolean validateCardDetails(PaymentRequest paymentRequest) {
        return paymentRequest.getCardNumber() != null && 
               paymentRequest.getCardNumber().length() >= 13 &&
               paymentRequest.getCardHolderName() != null &&
               paymentRequest.getExpiryMonth() != null &&
               paymentRequest.getExpiryYear() != null &&
               paymentRequest.getCvv() != null &&
               paymentRequest.getCvv().length() >= 3;
    }

    private boolean validateUpiDetails(PaymentRequest paymentRequest) {
        return paymentRequest.getUpiId() != null && 
               paymentRequest.getUpiId().contains("@") &&
               paymentRequest.getUpiId().length() > 5;
    }

    private boolean validateWalletDetails(PaymentRequest paymentRequest) {
        return paymentRequest.getWalletType() != null &&
               paymentRequest.getWalletPhone() != null &&
               paymentRequest.getWalletPhone().length() == 10;
    }

    private boolean validateNetBankingDetails(PaymentRequest paymentRequest) {
        return paymentRequest.getBankCode() != null &&
               paymentRequest.getBankCode().length() > 2;
    }
}