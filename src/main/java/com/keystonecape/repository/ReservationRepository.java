package com.keystonecape.repository;

import com.keystonecape.entity.Reservation;
import com.keystonecape.entity.Theme;
import com.keystonecape.entity.TimeSlot;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    // 검색 기능: 예약자명, 연락처, 또는 예약번호(ID) 포함 여부 조회
    @Query("SELECT r FROM Reservation r WHERE " +
            "r.customerName LIKE %:keyword% OR " +
            "r.customerPhone LIKE %:keyword% OR " +
            "CAST(r.reservationId AS string) LIKE %:keyword%")
    Page<Reservation> searchReservations(@Param("keyword") String keyword, Pageable pageable);

    List<Reservation> findByTheme_ThemeIdAndReservationDate(Long themeId, LocalDate reservationDate);

    boolean existsByThemeAndTimeSlotAndReservationDate(Theme theme, TimeSlot timeSlot, LocalDate reservationDate);

    boolean existsByTheme_ThemeIdAndTimeSlot_TimeSlotIdAndReservationDate(Long themeId, Long timeSlotId, LocalDate reservationDate);

    Optional<Reservation> findByReservationIdAndCustomerNameAndCustomerPhone(Long reservationId, String customerName, String customerPhone);
}