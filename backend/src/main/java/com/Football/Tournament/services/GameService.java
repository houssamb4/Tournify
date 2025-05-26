package com.Football.Tournament.services;

import com.Football.Tournament.dto.GameDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface GameService {
    GameDto createGame(GameDto gameDto);
    GameDto updateGame(Long id, GameDto gameDto);
    GameDto getGameById(Long id);
    Page<GameDto> getAllGames(Pageable pageable);
    Page<GameDto> getGamesByGenre(String genre, Pageable pageable);
    Page<GameDto> searchGames(String query, Pageable pageable);
    void deleteGame(Long id);
}
