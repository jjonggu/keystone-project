package com.keystonecape.repository;

import com.keystonecape.entity.Reservation;
import com.keystonecape.entity.Theme;
import com.keystonecape.entity.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ReservationRepository
        extends JpaRepository<Reservation, Long> {

    List<Reservation> findByTheme_ThemeIdAndReservationDate(
            Long themeId,
            LocalDate reservationDate
    );
    boolean existsByThemeAndTimeSlotAndReservationDate(
            Theme theme,
            TimeSlot timeSlot,
            LocalDate reservationDate
    );

    boolean existsByTheme_ThemeIdAndTimeSlot_TimeSlotIdAndReservationDate(
            Long themeId,
            Long timeSlotId,
            LocalDate reservationDate
    );

}
