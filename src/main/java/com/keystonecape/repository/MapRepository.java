package com.keystonecape.repository;

import com.keystonecape.entity.Map;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
// 소수점으로 들어가서 우선 Duble로 넣어 놓음 = 작을시 한단계 업
public interface MapRepository extends JpaRepository<Map, Double> {
}
