package com.moviebooking.controller;

import com.moviebooking.dto.*;
import com.moviebooking.entity.Show;
import com.moviebooking.entity.Seat;
import com.moviebooking.service.ShowService;
import com.moviebooking.service.SeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/booking")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class BookingFlowController {

    private final ShowService showService;
    private final SeatService seatService;

    /**
     * Get shows for a specific movie
     */
    @GetMapping("/movies/{movieId}/shows")
    public ResponseEntity<List<ShowDTO>> getShowsForMovie(
            @PathVariable Long movieId,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        
        List<Show> shows = showService.getShowsForMovie(movieId, city, date);
        List<ShowDTO> showDTOs = shows.stream()
                .map(this::convertToShowDTO)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(showDTOs);
    }

    /**
     * Get available seats for a show
     */
    @GetMapping("/shows/{showId}/seats")
    public ResponseEntity<List<SeatDTO>> getAvailableSeats(@PathVariable Long showId) {
        List<Seat> seats = seatService.getSeatsForShow(showId);
        List<SeatDTO> seatDTOs = seats.stream()
                .map(this::convertToSeatDTO)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(seatDTOs);
    }

    /**
     * Temporarily reserve seats for booking
     */
    @PostMapping("/seats/reserve")
    public ResponseEntity<MessageResponse> reserveSeats(
            @Valid @RequestBody SeatReservationRequest request) {
        
        boolean reserved = seatService.reserveSeats(request.getShowId(), request.getSeatIds(), 
                                                   request.getReservationTimeMinutes());
        
        if (reserved) {
            return ResponseEntity.ok(new MessageResponse("Seats reserved successfully"));
        } else {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Some seats are no longer available"));
        }
    }

    /**
     * Release reserved seats
     */
    @PostMapping("/seats/release")
    public ResponseEntity<MessageResponse> releaseSeats(
            @RequestParam Long showId,
            @RequestParam List<Long> seatIds) {
        
        seatService.releaseSeats(showId, seatIds);
        return ResponseEntity.ok(new MessageResponse("Seats released successfully"));
    }

    /**
     * Get booking summary before payment
     */
    @PostMapping("/summary")
    public ResponseEntity<BookingSummaryDTO> getBookingSummary(
            @RequestParam Long showId,
            @RequestParam List<Long> seatIds,
            @RequestParam(required = false) String promoCode) {
        
        BookingSummaryDTO summary = showService.calculateBookingSummary(showId, seatIds, promoCode);
        return ResponseEntity.ok(summary);
    }

    private ShowDTO convertToShowDTO(Show show) {
        return ShowDTO.builder()
                .id(show.getId())
                .movie(convertToMovieDTO(show.getMovie()))
                .venue(convertToVenueDTO(show.getVenue()))
                .showDate(show.getShowDate())
                .showTime(show.getShowTime())
                .screenName(show.getScreenName())
                .price(show.getPrice())
                .availableSeats(show.getAvailableSeats())
                .totalSeats(show.getTotalSeats())
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
                .price(seat.getPrice())
                .isAvailable(seat.getIsAvailable())
                .isBlocked(seat.getIsBlocked())
                .displayName(seat.getSeatRow() + seat.getSeatNumber())
                .build();
    }
}