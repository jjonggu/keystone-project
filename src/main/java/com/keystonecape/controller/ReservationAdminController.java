package com.keystonecape.controller;

import com.keystonecape.dto.AdminReservation;
import com.keystonecape.entity.Reservation;
import com.keystonecape.repository.ReservationRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
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

    @PutMapping("/reservations/{id}")
    public ResponseEntity<String> updateReservation(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body
    ) {
        Optional<Reservation> optional = reservationRepository.findById(id);
        if (optional.isEmpty()) return ResponseEntity.notFound().build();

        Reservation r = optional.get();

        if(body.containsKey("reservationStatus")) {
            r.setReservationStatus((String)body.get("reservationStatus"));
        }
        if(body.containsKey("headCount")) {
            Object head = body.get("headCount");
            if(head instanceof Number) {
                r.setHeadCount(((Number) head).intValue());
            }
        }

        reservationRepository.save(r);
        return ResponseEntity.ok("예약 업데이트 완료");
    }
}
