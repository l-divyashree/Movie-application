package com.moviebooking.service;

import com.moviebooking.entity.Show;
import com.moviebooking.repository.ShowRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ShowService {

    private final ShowRepository showRepository;

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
}