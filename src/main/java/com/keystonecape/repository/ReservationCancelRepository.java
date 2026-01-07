package com.keystonecape.repository;

import com.keystonecape.entity.ReservationCancel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationCancelRepository
        extends JpaRepository<ReservationCancel, Long> {
}
