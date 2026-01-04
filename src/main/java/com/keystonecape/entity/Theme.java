package com.keystonecape.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class Theme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long themeId;

    @Column(nullable = false, length = 100)
    private String themeName;

    @Column(columnDefinition = "TEXT")
    private String themeDescription;

    @Column(nullable = false)
    private int difficulty;

    @Column(nullable = false)
    private int minPerson;

    @Column(nullable = false)
    private int playTime;

    @Column(nullable = false)
    private int pricePerPerson;

    @Column(length = 255)
    private String imageUrl;

    @Column(nullable = false)
    private Boolean isActive;
}
