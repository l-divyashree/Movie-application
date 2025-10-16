package com.moviebooking.service;

import com.moviebooking.entity.City;
import com.moviebooking.repository.CityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CityService {

    private final CityRepository cityRepository;

    public List<City> getAllCities() {
        return cityRepository.findByIsActiveTrueOrderByName();
    }

    public City getCityById(Long id) {
        return cityRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("City not found with id: " + id));
    }

    public List<City> getCitiesByName(String name) {
        // Use basic findAll and filter if needed, or create a new method in repository
        return cityRepository.findByIsActiveTrueOrderByName()
            .stream()
            .filter(city -> city.getName().toLowerCase().contains(name.toLowerCase()))
            .toList();
    }
}