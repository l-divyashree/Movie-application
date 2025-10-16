package com.moviebooking.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/test")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TestController {
    
    @GetMapping("/simple")
    public ResponseEntity<String> simpleTest() {
        return ResponseEntity.ok("Test endpoint works!");
    }
    
    @GetMapping("/movies-test")
    public ResponseEntity<String> moviesTest() {
        return ResponseEntity.ok("Movies routing works!");
    }
}