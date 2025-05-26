package com.Football.Tournament.controller;

import com.Football.Tournament.entities.Players;
import com.Football.Tournament.entities.Teams;
import com.Football.Tournament.services.PlayerService;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Collections;
import java.util.Date;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.doNothing;

@ExtendWith(MockitoExtension.class)
public class PlayerControllerTest {

    @Mock
    private PlayerService playerService;

    @InjectMocks
    private PlayerController playerController;

    private Players testPlayer;
    private Teams testTeam;

    @BeforeEach
    void setUp() {
        testTeam = new Teams();
        testTeam.setId(1L);
        testTeam.setName("Test Team");
        testTeam.setLocation("Test Location");
        testTeam.setCreated_at(new Date());
        testTeam.setUpdated_at(new Date());

        testPlayer = new Players();
        testPlayer.setId(1L);
        testPlayer.setName("Test Player");
        testPlayer.setAge(25);
        testPlayer.setTeam(testTeam);
        testPlayer.setTeam_id(testTeam.getId());
        testPlayer.setCreated_at(new Date());
        testPlayer.setUpdated_at(new Date());
    }

    @Test
    void createPlayer_Success() {
        // Arrange
        when(playerService.createPlayer(any(Players.class))).thenReturn(testPlayer);

        // Act
        ResponseEntity<?> response = playerController.createPlayer(testPlayer);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    void listPlayers_Success() {
        // Arrange
        Page<Players> playerPage = new PageImpl<>(Collections.singletonList(testPlayer));
        when(playerService.listPlayers(any(Pageable.class))).thenReturn(playerPage);

        // Act
        ResponseEntity<?> response = playerController.listPlayers(PageRequest.of(0, 10));

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    void getPlayer_Success() {
        // Arrange
        when(playerService.findAPlayer(anyLong())).thenReturn(testPlayer);

        // Act
        ResponseEntity<?> response = playerController.getPlayer(1L);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    void updatePlayer_Success() {
        // Arrange
        when(playerService.updatePlayer(anyLong(), any(Players.class))).thenReturn(testPlayer);

        // Act
        ResponseEntity<?> response = playerController.updatePlayer(1L, testPlayer);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    void deletePlayer_Success() {
        // Arrange
        doNothing().when(playerService).deletePlayer(anyLong());

        // Act
        ResponseEntity<?> response = playerController.deletePlayer(1L);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
    }

    @Test
    void getPlayersByTeam_Success() {
        // Arrange
        List<Players> players = Collections.singletonList(testPlayer);
        when(playerService.playersByTeamId(anyLong())).thenReturn(players);

        // Act
        ResponseEntity<?> response = playerController.getPlayersByTeam(1L);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }
} 