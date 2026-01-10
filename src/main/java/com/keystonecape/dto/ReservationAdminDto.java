package com.keystonecape.dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationAdminDto {
    private Long reservationId;
    private LocalDate reservationDate;
    private String themeName;
    private String startTime;
    private String endTime; // 추가
    private String customerName;
    private String customerPhone;
    private int headCount;
    private String reservationStatus;
    private String refundBank;
    private String refundAccount;
    private LocalDateTime cancelledAt;
}

