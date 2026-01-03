package com.keystonecape.repository;

import com.keystonecape.entity.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TimeSlotRepository
        extends JpaRepository<TimeSlot, Long> {

    List<TimeSlot> findByTheme_ThemeId(Long themeId);
    List<TimeSlot> findByTheme_ThemeIdAndIsActiveTrue(Long themeId);
    List<TimeSlot> findByIsActiveTrue();
}
