package com.Football.Tournament.services;

import com.Football.Tournament.dto.GameDto;
import com.Football.Tournament.dto.GameDto.PlayerSummaryDto;
import com.Football.Tournament.dto.GameDto.TournamentSummaryDto;
import com.Football.Tournament.entities.Game;
import com.Football.Tournament.entities.Players;
import com.Football.Tournament.entities.Tournament;
import com.Football.Tournament.exception.ResourceNotFoundException;
import com.Football.Tournament.repository.GameRepository;
import com.Football.Tournament.dao.PlayerDao;
import com.Football.Tournament.dao.TournamentDao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class GameServiceImpl implements GameService {

    private final GameRepository gameRepository;
    private final PlayerDao playerDao;
    private final TournamentDao tournamentDao;

    @Autowired
    public GameServiceImpl(GameRepository gameRepository, PlayerDao playerDao, TournamentDao tournamentDao) {
        this.gameRepository = gameRepository;
        this.playerDao = playerDao;
        this.tournamentDao = tournamentDao;
    }

    @Override
    public GameDto createGame(GameDto gameDto) {
        Game game = mapToEntity(gameDto);
        Game savedGame = gameRepository.save(game);
        return mapToDto(savedGame);
    }

    @Override
    public GameDto updateGame(Long id, GameDto gameDto) {
        Game game = gameRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Game not found with id: " + id));

        game.setName(gameDto.getName());
        game.setIcon(gameDto.getIcon());
        game.setDeveloper(gameDto.getDeveloper());
        game.setGameGenre(gameDto.getGameGenre());
        
        Game savedGame = gameRepository.save(game);
        return mapToDto(savedGame);
    }

    @Override
    public GameDto getGameById(Long id) {
        Game game = gameRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Game not found with id: " + id));
        return mapToDto(game);
    }

    @Override
    public Page<GameDto> getAllGames(Pageable pageable) {
        Page<Game> games = gameRepository.findAll(pageable);
        return games.map(this::mapToDto);
    }

    @Override
    public Page<GameDto> getGamesByGenre(String genreCode, Pageable pageable) {
        Page<Game> games = gameRepository.findByGameGenreIgnoreCase(genreCode, pageable);
        return games.map(this::mapToDto);
    }

    @Override
    public Page<GameDto> searchGames(String query, Pageable pageable) {
        Page<Game> games = gameRepository.findByNameContainingIgnoreCase(query, pageable);
        return games.map(this::mapToDto);
    }

    @Override
    public void deleteGame(Long id) {
        Game game = gameRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Game not found with id: " + id));
        gameRepository.delete(game);
    }

    private GameDto mapToDto(Game game) {
        GameDto dto = new GameDto();
        dto.setId(game.getId());
        dto.setName(game.getName());
        dto.setIcon(game.getIcon());
        dto.setDeveloper(game.getDeveloper());
        dto.setGameGenre(game.getGameGenre());
        
        if (game.getTournaments() != null) {
            dto.setTournamentCount(game.getTournaments().size());
        }
        
        return dto;
    }

    private Game mapToEntity(GameDto dto) {
        Game game = new Game();
        game.setName(dto.getName());
        game.setIcon(dto.getIcon());
        game.setDeveloper(dto.getDeveloper());
        game.setGameGenre(dto.getGameGenre());
        return game;
    }
}
