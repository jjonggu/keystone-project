package com.keystonecape.controller;

import com.keystonecape.dto.RefundAccountRequest;
import com.keystonecape.entity.Reservation;
import com.keystonecape.entity.Theme;
import com.keystonecape.entity.TimeSlot;
import com.keystonecape.repository.ReservationRepository;
import com.keystonecape.repository.ThemeRepository;
import com.keystonecape.repository.TimeSlotRepository;
import com.keystonecape.service.RecaptchaService;
import com.keystonecape.service.ReservationService;
import com.keystonecape.service.SmsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ReservationController {

    private final ReservationRepository reservationRepository;
    private final ThemeRepository themeRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final RecaptchaService recaptchaService;
    private final SmsService smsService;
    private final ReservationService reservationService;


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

        // reCAPTCHA 검증
        String captchaToken = body.get("captchaToken").toString();
        boolean captchaValid = recaptchaService.verify(captchaToken);

        if (!captchaValid) {
            throw new RuntimeException("reCAPTCHA 검증 실패");
        }

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
                .reservationStatus("WAIT")
                .build();

        reservationRepository.save(reservation);

        // 저장 후 PK
        Long reservationId = reservation.getReservationId();

        String toPhone =
                reservation.getCustomerPhone().replaceAll("-", "");

        System.out.println(">>> 문자 전송 시도 직전");

        // 문자 전송
        try {
            smsService.sendReservationSms(
                    reservationId,
                    toPhone,
                    reservation.getCustomerName(),
                    theme.getThemeName(),
                    date.toString(),
                    timeSlot.getStartTime().toString(),
                    reservation.getHeadCount(),
                    reservation.getHeadCount() * theme.getPricePerPerson()
            );
        } catch (Exception e) {
            log.error("문자 전송 실패", e);
            e.printStackTrace();
        }
        System.out.println(">>> 문자 전송 호출 끝");



    }
    //예약 조회

    @GetMapping("/reservations/confirm")
    public Map<String, Object> confirmReservation(
            @RequestParam Long reservationId,
            @RequestParam String name,
            @RequestParam String phone
    ) {
        Reservation r = reservationService.confirm(reservationId, name, phone);

        Map<String, Object> result = new HashMap<>();
        result.put("reservationId", r.getReservationId());
        result.put("reservationDate", r.getReservationDate());
        result.put("customerName", r.getCustomerName());
        result.put("customerPhone", r.getCustomerPhone());
        result.put("headCount", r.getHeadCount());
        result.put("paymentType", r.getPaymentType());
        result.put("reservationStatus", r.getReservationStatus());
        result.put("themeName", r.getTheme().getThemeName());
        result.put("startTime", r.getTimeSlot().getStartTime().toString());

        return result;
    }

    @PostMapping("/reservations/{id}/cancel")
    public Long cancelReservation(@PathVariable Long id) {
        return reservationService.cancelOnly(id);
    }

    @PutMapping("/reservations/cancel/{cancelId}/refund")
    public void saveRefundAccount(
            @PathVariable Long cancelId,
            @RequestBody RefundAccountRequest request
    ) {
        reservationService.saveRefundAccount(cancelId, request);
    }







}

