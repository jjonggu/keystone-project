package com.keystonecape.controller;

import com.keystonecape.entity.Theme;
import com.keystonecape.service.ThemeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
