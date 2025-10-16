package com.moviebooking.controller;

import com.moviebooking.dto.BookingRequest;
import com.moviebooking.dto.MessageResponse;
import com.moviebooking.entity.Booking;
import com.moviebooking.entity.Seat;
import com.moviebooking.entity.Show;
import com.moviebooking.entity.User;
import com.moviebooking.repository.BookingRepository;
import com.moviebooking.repository.SeatRepository;
import com.moviebooking.repository.ShowRepository;
import com.moviebooking.repository.UserRepository;
import com.moviebooking.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class BookingController {

    private final BookingRepository bookingRepository;
    private final ShowRepository showRepository;
    private final SeatRepository seatRepository;
    private final UserRepository userRepository;

    /**
     * Create a new booking
     */
    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> createBooking(
            @Valid @RequestBody BookingRequest bookingRequest,
            Authentication authentication) {
        
        try {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            Long userId = userPrincipal.getId();

            // Get user, show, and validate seats
            Optional<User> userOpt = userRepository.findById(userId);
            Optional<Show> showOpt = showRepository.findById(bookingRequest.getShowId());

            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(new MessageResponse("User not found"));
            }
            if (showOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(new MessageResponse("Show not found"));
            }

            User user = userOpt.get();
            Show show = showOpt.get();

            // Validate that all selected seats are available
            List<Seat> selectedSeats = seatRepository.findByIdInAndIsAvailableTrue(bookingRequest.getSeatIds());
            
            if (selectedSeats.size() != bookingRequest.getSeatIds().size()) {
                return ResponseEntity.badRequest().body(new MessageResponse("Some selected seats are no longer available"));
            }

            // Calculate total amount
            BigDecimal totalAmount = selectedSeats.stream()
                .map(Seat::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

            // Create booking
            Booking booking = Booking.builder()
                .user(user)
                .show(show)
                .totalAmount(totalAmount)
                .bookingDate(LocalDateTime.now())
                .bookingStatus("CONFIRMED")
                .paymentStatus("PENDING")
                .paymentMethod(bookingRequest.getPaymentMethod())
                .build();

            // Add selected seats to booking
            selectedSeats.forEach(booking::addSeat);

            // Save booking
            Booking savedBooking = bookingRepository.save(booking);

            // Mark seats as booked
            seatRepository.markSeatsAsBooked(bookingRequest.getSeatIds());

            // Update show's available seats count
            int newAvailableCount = seatRepository.countAvailableSeatsByShowId(show.getId());
            show.setAvailableSeats(newAvailableCount);
            showRepository.save(show);

            return ResponseEntity.ok(savedBooking);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(new MessageResponse("Error creating booking: " + e.getMessage()));
        }
    }

    /**
     * Get user's bookings
     */
    @GetMapping("/my-bookings")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Page<Booking>> getUserBookings(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Long userId = userPrincipal.getId();
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Booking> bookings = bookingRepository.findByUserIdOrderByBookingDateDesc(userId, pageable);
        
        return ResponseEntity.ok(bookings);
    }

    /**
     * Get booking by reference number
     */
    @GetMapping("/reference/{reference}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Booking> getBookingByReference(@PathVariable String reference) {
        Optional<Booking> booking = bookingRepository.findByBookingReference(reference);
        
        if (booking.isPresent()) {
            return ResponseEntity.ok(booking.get());
        }
        
        return ResponseEntity.notFound().build();
    }

    /**
     * Cancel a booking
     */
    @PutMapping("/{bookingId}/cancel")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> cancelBooking(
            @PathVariable Long bookingId,
            Authentication authentication) {
        
        try {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            Long userId = userPrincipal.getId();

            Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
            
            if (bookingOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Booking booking = bookingOpt.get();

            // Check if user owns this booking (unless admin)
            boolean isAdmin = userPrincipal.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
            
            if (!isAdmin && !booking.getUser().getId().equals(userId)) {
                return ResponseEntity.status(403).body(new MessageResponse("Access denied"));
            }

            // Check if booking can be cancelled (not already cancelled)
            if ("CANCELLED".equals(booking.getBookingStatus())) {
                return ResponseEntity.badRequest().body(new MessageResponse("Booking is already cancelled"));
            }

            // Update booking status
            booking.setBookingStatus("CANCELLED");
            bookingRepository.save(booking);

            // Free up the seats
            List<Long> seatIds = booking.getSeats().stream()
                .map(Seat::getId)
                .toList();
            
            seatRepository.markSeatsAsAvailable(seatIds);

            // Update show's available seats count
            Show show = booking.getShow();
            int newAvailableCount = seatRepository.countAvailableSeatsByShowId(show.getId());
            show.setAvailableSeats(newAvailableCount);
            showRepository.save(show);

            return ResponseEntity.ok(new MessageResponse("Booking cancelled successfully"));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(new MessageResponse("Error cancelling booking: " + e.getMessage()));
        }
    }

    /**
     * Admin: Get all bookings
     */
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<Booking>> getAllBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Booking> bookings;
        
        if (status != null && !status.isEmpty()) {
            bookings = bookingRepository.findByBookingStatusOrderByBookingDateDesc(status, pageable);
        } else {
            bookings = bookingRepository.findAll(pageable);
        }
        
        return ResponseEntity.ok(bookings);
    }

    /**
     * Update payment status
     */
    @PutMapping("/{bookingId}/payment-status")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> updatePaymentStatus(
            @PathVariable Long bookingId,
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        
        try {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            Long userId = userPrincipal.getId();
            String paymentStatus = request.get("paymentStatus");
            String transactionId = request.get("transactionId");

            Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
            
            if (bookingOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Booking booking = bookingOpt.get();

            // Check if user owns this booking (unless admin)
            boolean isAdmin = userPrincipal.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
            
            if (!isAdmin && !booking.getUser().getId().equals(userId)) {
                return ResponseEntity.status(403).body(new MessageResponse("Access denied"));
            }

            booking.setPaymentStatus(paymentStatus);
            if (transactionId != null) {
                booking.setTransactionId(transactionId);
            }
            
            bookingRepository.save(booking);

            return ResponseEntity.ok(new MessageResponse("Payment status updated successfully"));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(new MessageResponse("Error updating payment status: " + e.getMessage()));
        }
    }
}