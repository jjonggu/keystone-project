package com.keystonecape.service;

import com.keystonecape.entity.Theme;
import com.keystonecape.repository.ThemeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ThemeService {

    private final ThemeRepository themeRepository;

    public List<Theme> themeList() {
        return themeRepository.findAll();
    }
}
