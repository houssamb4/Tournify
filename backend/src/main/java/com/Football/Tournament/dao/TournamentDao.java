package com.Football.Tournament.dao;

import java.util.Date;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Football.Tournament.entities.Tournament;

@Repository
public interface TournamentDao extends JpaRepository<Tournament, Long> {
    
    Page<Tournament> findByNameContaining(String name, Pageable pageable);
    
    Page<Tournament> findByStartDateLessThanEqualAndEndDateGreaterThanEqual(
        Date currentDate, Date endDate, Pageable pageable);
    
    Page<Tournament> findByTeamsId(Long teamId, Pageable pageable);
    
    Page<Tournament> findByStartDateAfter(Date date, Pageable pageable);
    
    Page<Tournament> findByEndDateBefore(Date date, Pageable pageable);
    
    Tournament findByLogoUrl(String logoUrl);
    
    // Find tournaments by game id
    Page<Tournament> findByGameId(Long gameId, Pageable pageable);
    
    // Find all tournaments by game id without pagination
    List<Tournament> findByGameId(Long gameId);
}