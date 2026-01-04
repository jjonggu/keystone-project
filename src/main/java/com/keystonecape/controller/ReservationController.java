package com.keystonecape.controller;

import com.keystonecape.entity.Reservation;
import com.keystonecape.entity.Theme;
import com.keystonecape.entity.TimeSlot;
import com.keystonecape.repository.ReservationRepository;
import com.keystonecape.repository.ThemeRepository;
import com.keystonecape.repository.TimeSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ReservationController {

    private final ReservationRepository reservationRepository;
    private final ThemeRepository themeRepository;
    private final TimeSlotRepository timeSlotRepository;

    @GetMapping("/themes/{themeId}/available-times")
    public List<Map<String, Object>> getAvailableTimes(
            @PathVariable Long themeId,
            @RequestParam String date
    ) {
        LocalDate targetDate = LocalDate.parse(date);

        List<TimeSlot> allSlots =
                timeSlotRepository.findByIsActiveTrue();

        List<Long> reservedSlotIds =
                reservationRepository
                        .findByTheme_ThemeIdAndReservationDate(themeId, targetDate)
                        .stream()
                        .map(r -> r.getTimeSlot().getTimeSlotId())
                        .collect(Collectors.toList());

        return allSlots.stream()
                .map(slot -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("timeSlotId", slot.getTimeSlotId());
                    map.put("startTime", slot.getStartTime());
                    map.put("endTime", slot.getEndTime());
                    map.put("reserved", reservedSlotIds.contains(slot.getTimeSlotId()));
                    return map;
                })
                .collect(Collectors.toList());
    }

    @PostMapping("/reservations")
    public void createReservation(@RequestBody Map<String, Object> body) {

        Long themeId = Long.valueOf(body.get("themeId").toString());
        Long timeSlotId = Long.valueOf(body.get("timeSlotId").toString());
        LocalDate date = LocalDate.parse(body.get("reservationDate").toString());

        Theme theme = themeRepository.findById(themeId)
                .orElseThrow(() -> new RuntimeException("Theme 없음"));

        TimeSlot timeSlot = timeSlotRepository.findById(timeSlotId)
                .orElseThrow(() -> new RuntimeException("TimeSlot 없음"));
        
        // 예약된 테마는 비활성화
        boolean exists = reservationRepository
                        .existsByThemeAndTimeSlotAndReservationDate(theme, timeSlot, date);

        if (exists) {
            throw new RuntimeException("이미 예약된 시간입니다.");
        }

        Reservation reservation = Reservation.builder()
                .theme(theme)
                .timeSlot(timeSlot)
                .reservationDate(date)
                .customerName(body.get("customerName").toString())
                .customerPhone(body.get("customerPhone").toString())
                .headCount(Integer.parseInt(body.get("headCount").toString()))
                .paymentType(body.get("paymentType").toString())
                .reservationStatus("CONFIRMED")
                .build();

        reservationRepository.save(reservation);
    }

}

