package com.moviebooking.controller;

import com.moviebooking.entity.City;
import com.moviebooking.service.CityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cities")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class CityController {

    private final CityService cityService;

    /**
     * Get all cities
     */
    @GetMapping
    public ResponseEntity<List<City>> getAllCities() {
        List<City> cities = cityService.getAllCities();
        return ResponseEntity.ok(cities);
    }

    /**
     * Get city by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<City> getCityById(@PathVariable Long id) {
        City city = cityService.getCityById(id);
        return ResponseEntity.ok(city);
    }

    /**
     * Search cities by name
     */
    @GetMapping("/search")
    public ResponseEntity<List<City>> searchCities(@RequestParam String name) {
        List<City> cities = cityService.getCitiesByName(name);
        return ResponseEntity.ok(cities);
    }
}