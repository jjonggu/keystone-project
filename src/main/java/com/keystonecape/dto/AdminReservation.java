package com.keystonecape.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdminReservation {
    private Long reservationId;
    private LocalDate reservationDate;
    private String themeName;
    private String startTime;
    private String endTime;
    private String customerName;
    private String customerPhone;
    private int headCount;
    private String reservationStatus;

    // 취소 모달을 위한 필수 추가 필드
    private String refundBank;
    private String refundAccount;
    private LocalDateTime cancelledAt;

    @Builder.Default
    private String refundStatus = "PENDING"; // PENDING, COMPLETED
}