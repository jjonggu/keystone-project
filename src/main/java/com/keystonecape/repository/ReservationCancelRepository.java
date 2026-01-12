package com.keystonecape.repository;

import com.keystonecape.entity.ReservationCancel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReservationCancelRepository extends JpaRepository<ReservationCancel, Long> {

    // 검색 기능: 취소 목록 내 이름, 연락처, 또는 예약번호(ID) 검색
    @Query("SELECT c FROM ReservationCancel c WHERE " +
            "c.customerName LIKE %:keyword% OR " +
            "c.customerPhone LIKE %:keyword% OR " +
            "CAST(c.reservationId AS string) LIKE %:keyword%")
    List<ReservationCancel> searchCancelled(@Param("keyword") String keyword);

    Optional<ReservationCancel> findByReservationId(Long reservationId);
}