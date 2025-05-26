package com.Football.Tournament.repository;

import com.Football.Tournament.entities.Game;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {
    Page<Game> findByGameGenreIgnoreCase(String gameGenre, Pageable pageable);
    Page<Game> findByNameContainingIgnoreCase(String name, Pageable pageable);
    // Removed findTop10ByOrderByActivePlayersCountDesc() since activePlayersCount is no longer in the Game entity
    // Popular games will be determined by the player count in the service layer
}
