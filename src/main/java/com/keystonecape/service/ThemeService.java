package com.keystonecape.service;

import com.keystonecape.entity.Theme;
import com.keystonecape.entity.TimeSlot;
import com.keystonecape.repository.ReservationRepository;
import com.keystonecape.repository.ThemeRepository;
import com.keystonecape.repository.TimeSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ThemeService {

    private final TimeSlotRepository timeSlotRepository;
    private final ReservationRepository reservationRepository;
    private final ThemeRepository themeRepository;

    public List<Theme> themeList() {
        return themeRepository.findAll();
    }


    public List<TimeSlot> getAvailableTimes(Long themeId, LocalDate date) {

        List<TimeSlot> allSlots =
                timeSlotRepository.findByTheme_ThemeId(themeId);

        return allSlots.stream()
                .filter(slot ->
                        !reservationRepository.existsByTheme_ThemeIdAndTimeSlot_TimeSlotIdAndReservationDate(
                                themeId,
                                slot.getTimeSlotId(),
                                date
                        )
                )
                .toList();
    }







}
