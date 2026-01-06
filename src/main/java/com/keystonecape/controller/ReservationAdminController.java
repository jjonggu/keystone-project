package com.keystonecape.controller;

import com.keystonecape.dto.AdminReservation;
import com.keystonecape.entity.Reservation;
import com.keystonecape.repository.ReservationRepository;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@AllArgsConstructor
@RequestMapping("/api/admin")
public class ReservationAdminController {

    private final ReservationRepository reservationRepository;

    @GetMapping("/reservations")
    public List<AdminReservation> getAllReservations() {
        return reservationRepository.findAll()
                .stream()
                .map(r -> new AdminReservation(
                        r.getReservationId(),
                        r.getReservationDate(),
                        r.getTheme().getThemeName(),
                        r.getTimeSlot().getStartTime().toString(),
                        r.getTimeSlot().getEndTime().toString(),
                        r.getCustomerName(),
                        r.getCustomerPhone(),
                        r.getHeadCount(),
                        r.getReservationStatus()
                ))
                .collect(Collectors.toList());
    }
}
