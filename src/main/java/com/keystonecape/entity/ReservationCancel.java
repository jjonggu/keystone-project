package com.keystonecape.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "reservation_cancel")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationCancel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cancelId;

    private Long reservationId;
    private String themeName;
    private LocalDate reservationDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String customerName;
    private String customerPhone;
    private int headCount;
    private String paymentType;
    private String refundBank;
    private String refundAccount;
    private LocalDateTime cancelledAt;

    @Column(nullable = false)
    @Builder.Default
    private String reservationStatus = "CANCELLED";

    @Column(nullable = false)
    @Builder.Default
    private String refundStatus = "PENDING";
}