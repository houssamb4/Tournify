package com.Football.Tournament.services;

import com.Football.Tournament.dto.GameDto;
import com.Football.Tournament.entities.Game;
import com.Football.Tournament.entities.Tournament;
import com.Football.Tournament.exception.ResourceNotFoundException;
import com.Football.Tournament.repository.GameRepository;
import com.Football.Tournament.dao.PlayerDao;
import com.Football.Tournament.dao.TournamentDao;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.*;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class GameServiceTest {

    @Mock
    private GameRepository gameRepository;

    @Mock
    private PlayerDao playerDao;

    @Mock
    private TournamentDao tournamentDao;

    @InjectMocks
    private GameServiceImpl gameService;

    private Game testGame;
    private GameDto testGameDto;
    private Tournament testTournament;

    @BeforeEach
    void setUp() {
        // Setup test game
        testGame = new Game();
        testGame.setId(1L);
        testGame.setName("Test Game");
        testGame.setIcon("test-icon.png");
        testGame.setDeveloper("Test Developer");
        testGame.setGameGenre("Sports");

        // Setup test game DTO
        testGameDto = new GameDto();
        testGameDto.setId(1L);
        testGameDto.setName("Test Game");
        testGameDto.setIcon("test-icon.png");
        testGameDto.setDeveloper("Test Developer");
        testGameDto.setGameGenre("Sports");

        // Setup test tournament
        testTournament = new Tournament();
        testTournament.setId(1L);
        testTournament.setName("Test Tournament");
        testTournament.setGame(testGame);
    }

    @Test
    void createGame_Success() {
        // Arrange
        when(gameRepository.save(any(Game.class))).thenReturn(testGame);

        // Act
        GameDto createdGame = gameService.createGame(testGameDto);

        // Assert
        assertNotNull(createdGame);
        assertEquals(testGameDto.getName(), createdGame.getName());
        assertEquals(testGameDto.getIcon(), createdGame.getIcon());
        assertEquals(testGameDto.getDeveloper(), createdGame.getDeveloper());
        assertEquals(testGameDto.getGameGenre(), createdGame.getGameGenre());
        verify(gameRepository).save(any(Game.class));
    }

    @Test
    void updateGame_Success() {
        // Arrange
        when(gameRepository.findById(anyLong())).thenReturn(Optional.of(testGame));
        when(gameRepository.save(any(Game.class))).thenReturn(testGame);

        // Modify the DTO
        testGameDto.setName("Updated Game");
        testGameDto.setDeveloper("Updated Developer");

        // Act
        GameDto result = gameService.updateGame(1L, testGameDto);

        // Assert
        assertNotNull(result);
        assertEquals(testGameDto.getName(), result.getName());
        assertEquals(testGameDto.getDeveloper(), result.getDeveloper());
        verify(gameRepository).findById(1L);
        verify(gameRepository).save(any(Game.class));
    }

    @Test
    void updateGame_GameNotFound() {
        // Arrange
        when(gameRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> 
            gameService.updateGame(1L, testGameDto));
        verify(gameRepository).findById(1L);
        verify(gameRepository, never()).save(any(Game.class));
    }

    @Test
    void getGameById_Success() {
        // Arrange
        when(gameRepository.findById(anyLong())).thenReturn(Optional.of(testGame));

        // Act
        GameDto result = gameService.getGameById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(testGame.getName(), result.getName());
        assertEquals(testGame.getIcon(), result.getIcon());
        verify(gameRepository).findById(1L);
    }

    @Test
    void getGameById_GameNotFound() {
        // Arrange
        when(gameRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> 
            gameService.getGameById(1L));
        verify(gameRepository).findById(1L);
    }

    @Test
    void getAllGames_Success() {
        // Arrange
        Page<Game> gamePage = new PageImpl<>(Collections.singletonList(testGame));
        when(gameRepository.findAll(any(Pageable.class))).thenReturn(gamePage);

        // Act
        Page<GameDto> result = gameService.getAllGames(PageRequest.of(0, 10));

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(testGame.getName(), result.getContent().get(0).getName());
        verify(gameRepository).findAll(any(Pageable.class));
    }

    @Test
    void getGamesByGenre_Success() {
        // Arrange
        Page<Game> gamePage = new PageImpl<>(Collections.singletonList(testGame));
        when(gameRepository.findByGameGenreIgnoreCase(anyString(), any(Pageable.class)))
            .thenReturn(gamePage);

        // Act
        Page<GameDto> result = gameService.getGamesByGenre("Sports", PageRequest.of(0, 10));

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(testGame.getGameGenre(), result.getContent().get(0).getGameGenre());
        verify(gameRepository).findByGameGenreIgnoreCase(eq("Sports"), any(Pageable.class));
    }

    @Test
    void searchGames_Success() {
        // Arrange
        Page<Game> gamePage = new PageImpl<>(Collections.singletonList(testGame));
        when(gameRepository.findByNameContainingIgnoreCase(anyString(), any(Pageable.class)))
            .thenReturn(gamePage);

        // Act
        Page<GameDto> result = gameService.searchGames("Test", PageRequest.of(0, 10));

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertTrue(result.getContent().get(0).getName().contains("Test"));
        verify(gameRepository).findByNameContainingIgnoreCase(eq("Test"), any(Pageable.class));
    }

    @Test
    void deleteGame_Success() {
        // Arrange
        when(gameRepository.findById(anyLong())).thenReturn(Optional.of(testGame));
        doNothing().when(gameRepository).delete(any(Game.class));

        // Act
        gameService.deleteGame(1L);

        // Assert
        verify(gameRepository).findById(1L);
        verify(gameRepository).delete(testGame);
    }

    @Test
    void deleteGame_GameNotFound() {
        // Arrange
        when(gameRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> 
            gameService.deleteGame(1L));
        verify(gameRepository).findById(1L);
        verify(gameRepository, never()).delete(any(Game.class));
    }
} 