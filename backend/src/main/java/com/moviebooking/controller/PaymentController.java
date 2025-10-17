package com.moviebooking.controller;

import com.moviebooking.dto.*;
import com.moviebooking.service.BookingService;
import com.moviebooking.service.PaymentService;
import com.moviebooking.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class PaymentController {

    private final PaymentService paymentService;
    private final BookingService bookingService;

    /**
     * Create a booking with payment
     */
    @PostMapping("/book")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> createBookingWithPayment(
            @Valid @RequestBody BookingCreateRequest request,
            Authentication authentication) {
        
        try {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            
            // Process payment first
            PaymentResponse paymentResponse = paymentService.processPayment(request.getPaymentDetails());
            
            if ("SUCCESS".equals(paymentResponse.getPaymentStatus())) {
                // Create booking if payment successful
                BookingResponse booking = bookingService.createBookingWithPayment(
                    request, userPrincipal.getId(), paymentResponse);
                
                return ResponseEntity.ok(booking);
            } else {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Payment failed: " + paymentResponse.getFailureReason()));
            }
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Booking failed: " + e.getMessage()));
        }
    }

    /**
     * Process payment for an existing booking
     */
    @PostMapping("/{bookingId}/pay")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> processPaymentForBooking(
            @PathVariable Long bookingId,
            @Valid @RequestBody PaymentRequest paymentRequest,
            Authentication authentication) {
        
        try {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            
            PaymentResponse paymentResponse = paymentService.processPaymentForBooking(
                bookingId, paymentRequest, userPrincipal.getId());
            
            return ResponseEntity.ok(paymentResponse);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Payment failed: " + e.getMessage()));
        }
    }

    /**
     * Get payment methods for user
     */
    @GetMapping("/methods")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getPaymentMethods(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        // This would typically return saved payment methods
        return ResponseEntity.ok(new MessageResponse("Payment methods retrieved"));
    }

    /**
     * Validate payment details
     */
    @PostMapping("/validate")
    public ResponseEntity<?> validatePaymentDetails(@Valid @RequestBody PaymentRequest paymentRequest) {
        boolean isValid = paymentService.validatePaymentDetails(paymentRequest);
        
        if (isValid) {
            return ResponseEntity.ok(new MessageResponse("Payment details are valid"));
        } else {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Invalid payment details"));
        }
    }
}