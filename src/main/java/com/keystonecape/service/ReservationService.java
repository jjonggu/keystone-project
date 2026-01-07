package com.keystonecape.service;

import com.keystonecape.dto.RefundAccountRequest;
import com.keystonecape.entity.Reservation;
import com.keystonecape.entity.ReservationCancel;
import com.keystonecape.repository.ReservationCancelRepository;
import com.keystonecape.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ReservationCancelRepository reservationCancelRepository;

    @Transactional(readOnly = true)
    public Reservation confirm(Long reservationId, String name, String phone) {
        return reservationRepository
                .findByReservationIdAndCustomerNameAndCustomerPhone(
                        reservationId, name, phone
                )
                .orElseThrow(() -> new RuntimeException("예약 없음"));
    }

    /**
     * 예약 취소 (이력 저장 후 삭제)
     */
    @Transactional
    public Long cancelOnly(Long reservationId) {

        Reservation r = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("예약 없음"));

        ReservationCancel cancel = ReservationCancel.builder()
                .reservationId(r.getReservationId())
                .themeName(r.getTheme().getThemeName())
                .reservationDate(r.getReservationDate())
                .startTime(r.getTimeSlot().getStartTime())
                .customerName(r.getCustomerName())
                .customerPhone(r.getCustomerPhone())
                .headCount(r.getHeadCount())
                .paymentType(r.getPaymentType())
                .cancelledAt(LocalDateTime.now())
                .build();

        reservationCancelRepository.save(cancel);

        // 🔥 즉시 삭제
        reservationRepository.delete(r);

        return cancel.getCancelId();
    }

    @Transactional
    public void saveRefundAccount(Long cancelId, RefundAccountRequest request) {

        ReservationCancel cancel = reservationCancelRepository.findById(cancelId)
                .orElseThrow(() -> new RuntimeException("취소 이력 없음"));

        cancel.setRefundBank(request.getRefundBank());
        cancel.setRefundAccount(request.getRefundAccount());
    }





}
