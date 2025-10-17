package com.moviebooking.service;

import com.moviebooking.dto.BookingSummaryDTO;
import com.moviebooking.dto.SeatDTO;
import com.moviebooking.dto.ShowDTO;
import com.moviebooking.entity.Seat;
import com.moviebooking.entity.Show;
import com.moviebooking.repository.SeatRepository;
import com.moviebooking.repository.ShowRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ShowService {

    private final ShowRepository showRepository;
    private final SeatRepository seatRepository;

    public Page<Show> getAllShows(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("showDate", "showTime"));
        return showRepository.findAllWithMovieAndVenue(pageable);
    }

    public Page<Show> getShowsByMovie(Long movieId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("showDate", "showTime"));
        return showRepository.findByMovieIdWithMovieAndVenue(movieId, pageable);
    }

    public Page<Show> getShowsByMovieAndCity(Long movieId, Long cityId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("showDate", "showTime"));
        return showRepository.findByMovieIdAndVenueCityIdWithMovieAndVenue(movieId, cityId, pageable);
    }

    public Page<Show> getShowsByDateAndCity(LocalDate date, Long cityId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("showTime"));
        return showRepository.findByShowDateAndVenueCityIdWithMovieAndVenue(date, cityId, pageable);
    }

    public List<Show> getShowsByVenue(Long venueId) {
        return showRepository.findByVenueIdWithMovieAndVenue(venueId);
    }

    public Optional<Show> getShowById(Long id) {
        return showRepository.findByIdWithMovieAndVenue(id);
    }

    // ===== ADMIN CRUD OPERATIONS =====

    @Transactional
    public Show createShow(Show show) {
        return showRepository.save(show);
    }

    @Transactional
    public Show updateShow(Long id, Show updatedShow) {
        Show existingShow = showRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Show not found with id: " + id));
        
        // Update the fields
        existingShow.setMovie(updatedShow.getMovie());
        existingShow.setVenue(updatedShow.getVenue());
        existingShow.setShowDate(updatedShow.getShowDate());
        existingShow.setShowTime(updatedShow.getShowTime());
        existingShow.setPrice(updatedShow.getPrice());
        existingShow.setScreenName(updatedShow.getScreenName());
        existingShow.setTotalSeats(updatedShow.getTotalSeats());
        existingShow.setAvailableSeats(updatedShow.getAvailableSeats());
        existingShow.setIsActive(updatedShow.getIsActive());
        
        return showRepository.save(existingShow);
    }

    @Transactional
    public void deleteShow(Long id) {
        if (!showRepository.existsById(id)) {
            throw new RuntimeException("Show not found with id: " + id);
        }
        showRepository.deleteById(id);
    }

    public long getTotalShowsCount() {
        return showRepository.count();
    }

    // New methods for booking flow
    public List<Show> getShowsForMovie(Long movieId, String city, LocalDate date) {
        if (city != null && date != null) {
            return showRepository.findByMovieIdAndCityAndDate(movieId, city, date);
        } else if (city != null) {
            return showRepository.findByMovieIdAndCity(movieId, city);
        } else if (date != null) {
            return showRepository.findByMovieIdAndDate(movieId, date);
        } else {
            return showRepository.findByMovieId(movieId);
        }
    }

    public BookingSummaryDTO calculateBookingSummary(Long showId, List<Long> seatIds, String promoCode) {
        Show show = showRepository.findById(showId)
                .orElseThrow(() -> new RuntimeException("Show not found"));

        List<Seat> seats = seatRepository.findByIdInAndShowId(seatIds, showId);
        
        if (seats.size() != seatIds.size()) {
            throw new RuntimeException("Some seats not found");
        }

        // Calculate pricing
        BigDecimal subtotal = seats.stream()
                .map(seat -> seat.getPrice() != null ? seat.getPrice() : show.getPrice())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Convenience fee (2% of subtotal, minimum Rs. 20)
        BigDecimal convenienceFee = subtotal.multiply(BigDecimal.valueOf(0.02));
        if (convenienceFee.compareTo(BigDecimal.valueOf(20)) < 0) {
            convenienceFee = BigDecimal.valueOf(20);
        }

        // Taxes (18% GST)
        BigDecimal taxes = subtotal.multiply(BigDecimal.valueOf(0.18));

        // Discount (mock promo code logic)
        BigDecimal discount = BigDecimal.ZERO;
        if ("SAVE10".equals(promoCode)) {
            discount = subtotal.multiply(BigDecimal.valueOf(0.10)); // 10% discount
        } else if ("FIRST50".equals(promoCode)) {
            discount = BigDecimal.valueOf(50); // Rs. 50 flat discount
        }

        BigDecimal totalAmount = subtotal.add(convenienceFee).add(taxes).subtract(discount);

        // Convert entities to DTOs
        List<SeatDTO> seatDTOs = seats.stream()
                .map(seat -> SeatDTO.builder()
                        .id(seat.getId())
                        .seatRow(seat.getSeatRow())
                        .seatNumber(seat.getSeatNumber())
                        .seatType(seat.getSeatType())
                        .price(seat.getPrice() != null ? seat.getPrice() : show.getPrice())
                        .displayName(seat.getSeatRow() + seat.getSeatNumber())
                        .build())
                .collect(Collectors.toList());

        return BookingSummaryDTO.builder()
                .selectedSeats(seatDTOs)
                .subtotal(subtotal)
                .taxes(taxes)
                .convenienceFee(convenienceFee)
                .discount(discount)
                .totalAmount(totalAmount)
                .promoCode(promoCode)
                .totalTickets(seats.size())
                .build();
    }
}