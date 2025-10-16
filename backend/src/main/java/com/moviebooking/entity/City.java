package com.moviebooking.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Entity
@Table(name = "cities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class City extends BaseEntity {

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String name;

    @Size(max = 100)
    @Column(length = 100)
    private String state;

    @Size(max = 100)
    @Builder.Default
    @Column(length = 100)
    private String country = "India";

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    public City(String name, String state, String country) {
        this.name = name;
        this.state = state;
        this.country = country;
        this.isActive = true;
    }
}