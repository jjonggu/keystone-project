package com.keystonecape.controller;

import com.keystonecape.dto.ReservationAdminDto;
import com.keystonecape.entity.Reservation;
import com.keystonecape.entity.ReservationCancel;
import com.keystonecape.repository.ReservationRepository;
import com.keystonecape.repository.ReservationCancelRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@AllArgsConstructor
@RequestMapping("/api/admin")
public class ReservationAdminController {

    private final ReservationRepository reservationRepository;
    private final ReservationCancelRepository cancelRepository;

    // ===== 일반 예약 조회 =====
    @GetMapping("/reservations")
    public Page<ReservationAdminDto> getReservations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);

        return reservationRepository.findAll(pageable)
                .map(r -> new ReservationAdminDto(
                        r.getReservationId(),
                        r.getReservationDate(),
                        r.getTheme().getThemeName(),
                        r.getTimeSlot().getStartTime().toString(),
                        r.getTimeSlot().getEndTime().toString(),
                        r.getCustomerName(),
                        r.getCustomerPhone(),
                        r.getHeadCount(),
                        r.getReservationStatus(),
                        "", // 일반 예약 은행 없음
                        "", // 일반 예약 계좌 없음
                        r.getCancelledAt()
                ));
    }

    // ===== 예약 상태 변경 및 수정 =====
    @PutMapping("/reservations/{id}")
    @Transactional
    public ResponseEntity<String> updateReservation(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body
    ) {
        Optional<Reservation> optional = reservationRepository.findById(id);
        if (optional.isEmpty()) return ResponseEntity.notFound().build();

        Reservation r = optional.get();
        boolean wasCancelled = "CANCELLED".equals(r.getReservationStatus());

        // 상태 변경 (취소 상태에서는 업데이트 막음)
        if (body.containsKey("reservationStatus")) {
            String newStatus = (String) body.get("reservationStatus");
            if (!"CANCELLED".equals(r.getReservationStatus())) {
                r.setReservationStatus(newStatus);
            }
        }

        // 인원 변경
        if (body.containsKey("headCount")) {
            Object head = body.get("headCount");
            if (head instanceof Number) r.setHeadCount(((Number) head).intValue());
        }

        // 환불 정보 변경 (취소가 아닌 경우)
        if (!"CANCELLED".equals(r.getReservationStatus())) {
            if (body.containsKey("refundBank")) r.setRefundBank((String) body.get("refundBank"));
            if (body.containsKey("refundAccount")) r.setRefundAccount((String) body.get("refundAccount"));
        }

        reservationRepository.save(r);

        // CANCELLED 상태로 변경 시, 취소 테이블에 기록
        if (!wasCancelled && "CANCELLED".equals(r.getReservationStatus())) {
            ReservationCancel cancel = new ReservationCancel();
            cancel.setReservationId(r.getReservationId());
            cancel.setReservationDate(r.getReservationDate());
            cancel.setThemeName(r.getTheme().getThemeName());
            cancel.setStartTime(r.getTimeSlot().getStartTime());
            cancel.setCustomerName(r.getCustomerName());
            cancel.setCustomerPhone(r.getCustomerPhone());
            cancel.setHeadCount(r.getHeadCount());
            cancel.setReservationStatus("CANCELLED");

            cancel.setPaymentType(r.getPaymentType() != null ? r.getPaymentType() : "");
            cancel.setRefundBank(r.getRefundBank() != null ? r.getRefundBank() : "");
            cancel.setRefundAccount(r.getRefundAccount() != null ? r.getRefundAccount() : "");
            cancel.setCancelledAt(LocalDateTime.now());

            cancelRepository.save(cancel);
        }

        return ResponseEntity.ok("예약 업데이트 완료");
    }

    // ===== 취소 예약 목록 조회 =====
    @GetMapping("/reservations/cancelled")
    public List<ReservationAdminDto> getCancelledReservations() {
        return cancelRepository.findAll()
                .stream()
                .map(c -> new ReservationAdminDto(
                        c.getReservationId(),
                        c.getReservationDate(),
                        c.getThemeName(),
                        c.getStartTime() != null ? c.getStartTime().toString() : "",
                        c.getEndTime() != null ? c.getEndTime().toString() : "",
                        c.getCustomerName(),
                        c.getCustomerPhone(),
                        c.getHeadCount(),
                        c.getReservationStatus(),
                        c.getRefundBank() != null ? c.getRefundBank() : "",
                        c.getRefundAccount() != null ? c.getRefundAccount() : "",
                        c.getCancelledAt()
                ))
                .collect(Collectors.toList());
    }
}
