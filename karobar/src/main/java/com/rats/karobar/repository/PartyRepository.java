package com.rats.karobar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rats.karobar.entity.PartyEntity;

@Repository
public interface PartyRepository extends JpaRepository<PartyEntity, Long> {

}
