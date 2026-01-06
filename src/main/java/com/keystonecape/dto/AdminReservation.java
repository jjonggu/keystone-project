package com.keystonecape.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
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
}
