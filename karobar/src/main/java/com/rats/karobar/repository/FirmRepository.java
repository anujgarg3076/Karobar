package com.rats.karobar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rats.karobar.entity.FirmEntity;

@Repository
public interface FirmRepository extends JpaRepository<FirmEntity, Long> {

}
