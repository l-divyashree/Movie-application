package com.moviebooking.service;

import com.moviebooking.dto.*;
import com.moviebooking.entity.Booking;
import com.moviebooking.entity.Seat;
import com.moviebooking.entity.Show;
import com.moviebooking.entity.User;
import com.moviebooking.repository.BookingRepository;
import com.moviebooking.repository.SeatRepository;
import com.moviebooking.repository.ShowRepository;
import com.moviebooking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ShowRepository showRepository;
    private final SeatRepository seatRepository;
    private final UserRepository userRepository;
    private final SeatService seatService;

    /**
     * Create a booking with payment
     */
    @Transactional
    public BookingResponse createBookingWithPayment(
            BookingCreateRequest request, 
            Long userId, 
            PaymentResponse paymentResponse) {
        
        // Get user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get show
        Show show = showRepository.findById(request.getShowId())
                .orElseThrow(() -> new RuntimeException("Show not found"));

        // Get seats
        List<Seat> seats = seatRepository.findByIdInAndShowId(request.getSeatIds(), request.getShowId());
        
        if (seats.size() != request.getSeatIds().size()) {
            throw new RuntimeException("Some seats not found");
        }

        // Verify all seats are available and blocked (reserved)
        for (Seat seat : seats) {
            if (!seat.getIsAvailable() || !seat.getIsBlocked()) {
                throw new RuntimeException("Seat " + seat.getSeatLabel() + " is no longer available");
            }
        }

        // Calculate total amount
        BigDecimal totalAmount = calculateTotalAmount(seats);

        // Create booking
        Booking booking = Booking.builder()
                .user(user)
                .show(show)
                .bookingDate(LocalDateTime.now())
                .totalAmount(totalAmount)
                .bookingStatus("CONFIRMED")
                .paymentStatus("SUCCESS".equals(paymentResponse.getPaymentStatus()) ? "COMPLETED" : "PENDING")
                .bookingReference(generateBookingReference())
                .transactionId(paymentResponse.getTransactionId())
                .paymentMethod(paymentResponse.getPaymentMethod())
                .build();

        // Save booking
        booking = bookingRepository.save(booking);

        // Add seats to booking
        for (Seat seat : seats) {
            booking.addSeat(seat);
        }
        booking = bookingRepository.save(booking);

        // Mark seats as booked
        seatService.bookSeats(request.getSeatIds());

        // Update show available seats count
        show.setAvailableSeats(show.getAvailableSeats() - seats.size());
        showRepository.save(show);

        // Convert to response
        return convertToBookingResponse(booking, seats, paymentResponse, request);
    }

    private BigDecimal calculateTotalAmount(List<Seat> seats) {
        BigDecimal subtotal = seats.stream()
                .map(seat -> seat.getPrice() != null ? seat.getPrice() : seat.getShow().getPrice())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Add convenience fee (2% of subtotal, minimum Rs. 20)
        BigDecimal convenienceFee = subtotal.multiply(BigDecimal.valueOf(0.02));
        if (convenienceFee.compareTo(BigDecimal.valueOf(20)) < 0) {
            convenienceFee = BigDecimal.valueOf(20);
        }

        // Add taxes (18% GST)
        BigDecimal taxes = subtotal.multiply(BigDecimal.valueOf(0.18));

        return subtotal.add(convenienceFee).add(taxes);
    }

    private String generateBookingReference() {
        return "MB" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
    }

    private String generateQRCode() {
        return "QR" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private BookingResponse convertToBookingResponse(Booking booking, List<Seat> seats, PaymentResponse paymentResponse, BookingCreateRequest request) {
        // Convert show
        ShowDTO showDTO = ShowDTO.builder()
                .id(booking.getShow().getId())
                .movie(convertToMovieDTO(booking.getShow().getMovie()))
                .venue(convertToVenueDTO(booking.getShow().getVenue()))
                .showDate(booking.getShow().getShowDate())
                .showTime(booking.getShow().getShowTime())
                .screenName(booking.getShow().getScreenName())
                .price(booking.getShow().getPrice())
                .build();

        // Convert seats
        List<SeatDTO> seatDTOs = seats.stream()
                .map(this::convertToSeatDTO)
                .collect(Collectors.toList());

        return BookingResponse.builder()
                .id(booking.getId())
                .bookingReference(booking.getBookingReference())
                .show(showDTO)
                .seats(seatDTOs)
                .totalAmount(booking.getTotalAmount())
                .bookingStatus(booking.getBookingStatus())
                .paymentStatus(booking.getPaymentStatus())
                .bookingDate(booking.getBookingDate())
                .qrCode(generateQRCode()) // Generate QR code for display
                .paymentDetails(paymentResponse)
                .specialRequests(request.getSpecialRequests()) // From request, not entity
                .canCancel(canCancelBooking(booking))
                .cancellationDeadline(getCancellationDeadline(booking))
                .build();
    }

    private MovieDTO convertToMovieDTO(com.moviebooking.entity.Movie movie) {
        return MovieDTO.builder()
                .id(movie.getId())
                .title(movie.getTitle())
                .description(movie.getDescription())
                .genre(movie.getGenre())
                .language(movie.getLanguage())
                .duration(movie.getDurationMinutes())
                .rating(movie.getRating())
                .posterUrl(movie.getPosterUrl())
                .trailerUrl(movie.getTrailerUrl())
                .director(movie.getDirector())
                .cast(movie.getCast())
                .nowShowing(movie.getIsNowShowing())
                .comingSoon(movie.getIsComingSoon())
                .build();
    }

    private VenueDTO convertToVenueDTO(com.moviebooking.entity.Venue venue) {
        return VenueDTO.builder()
                .id(venue.getId())
                .name(venue.getName())
                .address(venue.getAddress())
                .city(venue.getCity() != null ? venue.getCity().getName() : null)
                .state(venue.getCity() != null ? venue.getCity().getState() : null)
                .zipCode(null) // No zipCode in current City entity
                .phone(venue.getPhoneNumber())
                .email(venue.getEmail())
                .capacity(venue.getTotalSeats())
                .build();
    }

    private SeatDTO convertToSeatDTO(Seat seat) {
        return SeatDTO.builder()
                .id(seat.getId())
                .seatRow(seat.getSeatRow())
                .seatNumber(seat.getSeatNumber())
                .seatType(seat.getSeatType())
                .price(seat.getPrice() != null ? seat.getPrice() : seat.getShow().getPrice())
                .isAvailable(seat.getIsAvailable())
                .isBlocked(seat.getIsBlocked())
                .displayName(seat.getSeatRow() + seat.getSeatNumber())
                .build();
    }

    private boolean canCancelBooking(Booking booking) {
        // Can cancel if show is more than 2 hours away
        LocalDateTime showDateTime = LocalDateTime.of(
                booking.getShow().getShowDate(), 
                booking.getShow().getShowTime()
        );
        return LocalDateTime.now().plusHours(2).isBefore(showDateTime) && 
               "CONFIRMED".equals(booking.getBookingStatus());
    }

    private LocalDateTime getCancellationDeadline(Booking booking) {
        LocalDateTime showDateTime = LocalDateTime.of(
                booking.getShow().getShowDate(), 
                booking.getShow().getShowTime()
        );
        return showDateTime.minusHours(2);
    }
}