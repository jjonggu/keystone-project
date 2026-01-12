package com.keystonecape.controller;

import com.keystonecape.dto.AdminReservation;
import com.keystonecape.entity.Reservation;
import com.keystonecape.entity.ReservationCancel;
import com.keystonecape.repository.ReservationRepository;
import com.keystonecape.repository.ReservationCancelRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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

    /**
     * 1. 일반 예약 목록 조회 및 검색
     */
    @GetMapping("/reservations")
    public Page<AdminReservation> getReservations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("reservationId").descending());
        Page<Reservation> reservationPage;

        // 짧은 이름의 검색 메서드 호출
        if (keyword != null && !keyword.trim().isEmpty()) {
            reservationPage = reservationRepository.searchReservations(keyword, pageable);
        } else {
            reservationPage = reservationRepository.findAll(pageable);
        }

        return reservationPage.map(this::convertToAdminReservation);
    }

    /**
     * 2. 취소 목록 조회 및 검색
     */
    @GetMapping("/reservations/cancelled")
    public List<AdminReservation> getCancelledReservations(@RequestParam(required = false) String keyword) {
        List<ReservationCancel> cancelledList;

        if (keyword != null && !keyword.trim().isEmpty()) {
            cancelledList = cancelRepository.searchCancelled(keyword);
        } else {
            cancelledList = cancelRepository.findAll(Sort.by("cancelledAt").descending());
        }

        return cancelledList.stream()
                .map(this::convertToAdminReservationFromCancel)
                .collect(Collectors.toList());
    }

    /**
     * 3. 업데이트 로직 (상태 변경 및 환불 관리)
     */
    @PutMapping("/reservations/{id}")
    @Transactional
    public ResponseEntity<String> updateReservation(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body
    ) {
        // [A] 취소 테이블 환불 상태 업데이트
        cancelRepository.findByReservationId(id).ifPresent(c -> {
            if (body.containsKey("refundStatus")) {
                c.setRefundStatus((String) body.get("refundStatus"));
                cancelRepository.save(c);
            }
        });

        // [B] 일반 예약 수정
        Optional<Reservation> optional = reservationRepository.findById(id);
        if (optional.isEmpty()) return ResponseEntity.notFound().build();

        Reservation r = optional.get();
        boolean wasAlreadyCancelled = "CANCELLED".equals(r.getReservationStatus());

        if (body.containsKey("reservationStatus") && !wasAlreadyCancelled) {
            r.setReservationStatus((String) body.get("reservationStatus"));
        }
        if (body.containsKey("headCount")) {
            r.setHeadCount(((Number) body.get("headCount")).intValue());
        }
        if (body.containsKey("refundBank")) r.setRefundBank((String) body.get("refundBank"));
        if (body.containsKey("refundAccount")) r.setRefundAccount((String) body.get("refundAccount"));

        reservationRepository.save(r);

        // [C] 취소 데이터 생성 로직
        if (!wasAlreadyCancelled && "CANCELLED".equals(r.getReservationStatus())) {
            if (cancelRepository.findByReservationId(id).isEmpty()) {
                cancelRepository.save(createCancelEntity(r));
            }
        }

        return ResponseEntity.ok("업데이트 완료");
    }

    // --- DTO 변환 및 엔티티 생성 헬퍼 메서드 ---

    private AdminReservation convertToAdminReservation(Reservation r) {
        return AdminReservation.builder()
                .reservationId(r.getReservationId())
                .reservationDate(r.getReservationDate())
                .themeName(r.getTheme().getThemeName())
                .startTime(r.getTimeSlot().getStartTime().toString())
                .customerName(r.getCustomerName())
                .customerPhone(r.getCustomerPhone())
                .headCount(r.getHeadCount())
                .reservationStatus(r.getReservationStatus())
                .refundBank(r.getRefundBank() != null ? r.getRefundBank() : "")
                .refundAccount(r.getRefundAccount() != null ? r.getRefundAccount() : "")
                .cancelledAt(r.getCancelledAt())
                .refundStatus("N/A")
                .build();
    }

    private AdminReservation convertToAdminReservationFromCancel(ReservationCancel c) {
        return AdminReservation.builder()
                .reservationId(c.getReservationId())
                .reservationDate(c.getReservationDate())
                .themeName(c.getThemeName())
                .startTime(c.getStartTime().toString())
                .customerName(c.getCustomerName())
                .customerPhone(c.getCustomerPhone())
                .headCount(c.getHeadCount())
                .reservationStatus(c.getReservationStatus())
                .refundBank(c.getRefundBank())
                .refundAccount(c.getRefundAccount())
                .cancelledAt(c.getCancelledAt())
                .refundStatus(c.getRefundStatus())
                .build();
    }

    private ReservationCancel createCancelEntity(Reservation r) {
        return ReservationCancel.builder()
                .reservationId(r.getReservationId())
                .reservationDate(r.getReservationDate())
                .themeName(r.getTheme().getThemeName())
                .startTime(r.getTimeSlot().getStartTime())
                .customerName(r.getCustomerName())
                .customerPhone(r.getCustomerPhone())
                .headCount(r.getHeadCount())
                .paymentType(r.getPaymentType() != null ? r.getPaymentType() : "NONE")
                .refundBank(r.getRefundBank() != null ? r.getRefundBank() : "")
                .refundAccount(r.getRefundAccount() != null ? r.getRefundAccount() : "")
                .cancelledAt(LocalDateTime.now())
                .refundStatus("PENDING")
                .reservationStatus("CANCELLED")
                .build();
    }
}