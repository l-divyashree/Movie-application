package com.moviebooking.service;

import com.moviebooking.dto.VenueRequest;
import com.moviebooking.entity.City;
import com.moviebooking.entity.Venue;
import com.moviebooking.repository.CityRepository;
import com.moviebooking.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class VenueService {

    private final VenueRepository venueRepository;
    private final CityRepository cityRepository;

    public List<Venue> getAllVenues() {
        return venueRepository.findAllWithCity();
    }

    public List<Venue> getVenuesByCity(Long cityId) {
        return venueRepository.findByCityIdWithCity(cityId);
    }

    public List<Venue> getVenuesByName(String name) {
        return venueRepository.findByNameContainingIgnoreCaseWithCity(name);
    }

    public Venue getVenueById(Long id) {
        return venueRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Venue not found with id: " + id));
    }

    @Transactional
    public Venue createVenue(VenueRequest venueRequest) {
        // Find city
        City city = cityRepository.findById(venueRequest.getCity().getId())
            .orElseThrow(() -> new RuntimeException("City not found with id: " + venueRequest.getCity().getId()));
        
        // Create venue
        Venue venue = Venue.builder()
            .name(venueRequest.getName())
            .address(venueRequest.getAddress())
            .city(city)
            .totalScreens(venueRequest.getTotalScreens())
            .totalSeats(venueRequest.getTotalSeats())
            .phoneNumber(venueRequest.getPhone())
            .email(venueRequest.getEmail())
            .isActive(venueRequest.getIsActive() != null ? venueRequest.getIsActive() : true)
            .build();
        
        return venueRepository.save(venue);
    }

    @Transactional
    public Venue updateVenue(Long id, VenueRequest venueRequest) {
        Venue venue = getVenueById(id);
        
        // Find city
        City city = cityRepository.findById(venueRequest.getCity().getId())
            .orElseThrow(() -> new RuntimeException("City not found with id: " + venueRequest.getCity().getId()));
        
        // Update venue fields
        venue.setName(venueRequest.getName());
        venue.setAddress(venueRequest.getAddress());
        venue.setCity(city);
        venue.setTotalScreens(venueRequest.getTotalScreens());
        venue.setTotalSeats(venueRequest.getTotalSeats());
        venue.setPhoneNumber(venueRequest.getPhone());
        venue.setEmail(venueRequest.getEmail());
        venue.setIsActive(venueRequest.getIsActive() != null ? venueRequest.getIsActive() : true);
        
        return venueRepository.save(venue);
    }

    @Transactional
    public void deleteVenue(Long id) {
        Venue venue = getVenueById(id);
        venueRepository.delete(venue);
    }
}