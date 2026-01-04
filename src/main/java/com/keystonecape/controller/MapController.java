package com.keystonecape.controller;

import com.keystonecape.entity.Map;
import com.keystonecape.repository.MapRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class MapController {

    private final MapRepository mapRepository;

    @GetMapping("/map")
    public List<Map> getMapLocations() {
        return mapRepository.findAll();
    }
}
