package com.keystonecape.repository;

import com.keystonecape.entity.ReservationCancel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReservationCancelRepository extends JpaRepository<ReservationCancel, Long> {
    Optional<ReservationCancel> findByReservationId(Long reservationId);
}
