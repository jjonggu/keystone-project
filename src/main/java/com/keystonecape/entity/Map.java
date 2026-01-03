package com.keystonecape.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@Table(name = "map_location")
public class Map {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Map_id")
    private Long mapId;

    @Column(name = "Map_name", nullable = false, length = 100)
    private String mapName;

    @Column(nullable = false, length = 255)
    private String address;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;


}
