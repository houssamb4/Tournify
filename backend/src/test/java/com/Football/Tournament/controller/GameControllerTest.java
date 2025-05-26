package com.Football.Tournament.controller;

import com.Football.Tournament.dto.GameDto;
import com.Football.Tournament.services.GameService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.doNothing;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class GameControllerTest {

    @Mock
    private GameService gameService;

    @InjectMocks
    private GameController gameController;

    private GameDto testGameDto;

    @BeforeEach
    void setUp() {
        testGameDto = new GameDto();
        testGameDto.setId(1L);
        testGameDto.setName("Test Game");
        testGameDto.setIcon("test-icon.png");
        testGameDto.setDeveloper("Test Developer");
        testGameDto.setGameGenre("Sports");
    }

    @Test
    void createGame_Success() {
        // Arrange
        when(gameService.createGame(any(GameDto.class))).thenReturn(testGameDto);

        // Act
        ResponseEntity<?> response = gameController.createGame(testGameDto);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    void updateGame_Success() {
        // Arrange
        when(gameService.updateGame(any(Long.class), any(GameDto.class))).thenReturn(testGameDto);

        // Act
        ResponseEntity<?> response = gameController.updateGame(1L, testGameDto);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    void getGameById_Success() {
        // Arrange
        when(gameService.getGameById(any(Long.class))).thenReturn(testGameDto);

        // Act
        ResponseEntity<?> response = gameController.getGameById(1L);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    void getAllGames_Success() {
        // Arrange
        Page<GameDto> gamePage = new PageImpl<>(Collections.singletonList(testGameDto));
        when(gameService.getAllGames(any())).thenReturn(gamePage);

        // Act
        ResponseEntity<?> response = gameController.getAllGames(0, 10, "name");

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    void getGamesByGenre_Success() {
        // Arrange
        Page<GameDto> gamePage = new PageImpl<>(Collections.singletonList(testGameDto));
        when(gameService.getGamesByGenre(anyString(), any())).thenReturn(gamePage);

        // Act
        ResponseEntity<?> response = gameController.getGamesByGenre("Sports", 0, 10);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    void searchGames_Success() {
        // Arrange
        Page<GameDto> gamePage = new PageImpl<>(Collections.singletonList(testGameDto));
        when(gameService.searchGames(anyString(), any())).thenReturn(gamePage);

        // Act
        ResponseEntity<?> response = gameController.searchGames("Test", 0, 10);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    void deleteGame_Success() {
        // Arrange
        doNothing().when(gameService).deleteGame(anyLong());

        // Act
        ResponseEntity<?> response = gameController.deleteGame(1L);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
    }
} 