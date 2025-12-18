package com.keystonecape.controller;

import com.keystonecape.entity.Theme;
import com.keystonecape.service.ThemeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ThemeController {

    private final ThemeService themeService;

    @GetMapping("/themes")
    public List<Theme> theme() {
        return themeService.themeList();
    }

    @GetMapping("/themes/{id}")
    public Theme getTheme(@PathVariable Long id) {
        return themeService.themeList().stream()
                .filter(theme -> theme.getThemeId().equals(id))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Theme not found"));
    }
}
