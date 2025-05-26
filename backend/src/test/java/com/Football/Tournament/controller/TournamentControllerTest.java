package com.Football.Tournament.controller;

import com.Football.Tournament.entities.Tournament;
import com.Football.Tournament.entities.Teams;
import com.Football.Tournament.entities.Game;
import com.Football.Tournament.repository.GameRepository;
import com.Football.Tournament.services.TournamentService;
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
import org.springframework.mock.web.MockHttpServletRequest;

import java.util.Collections;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.doNothing;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class TournamentControllerTest {

    @Mock
    private TournamentService tournamentService;

    @Mock
    private GameRepository gameRepository;

    @InjectMocks
    private TournamentController tournamentController;

    private Tournament testTournament;
    private Teams testTeam;
    private Game testGame;
    private Date currentDate;

    @BeforeEach
    void setUp() {
        currentDate = new Date();

        // Setup test game
        testGame = new Game();
        testGame.setId(1L);
        testGame.setName("Test Game");
        testGame.setGameGenre("Sports");

        // Setup test tournament
        testTournament = new Tournament();
        testTournament.setId(1L);
        testTournament.setName("Test Tournament");
        testTournament.setLogoUrl("http://example.com/logo.png");
        testTournament.setStartDate(new Date(currentDate.getTime() - 86400000)); // Yesterday
        testTournament.setEndDate(new Date(currentDate.getTime() + 86400000));   // Tomorrow
        testTournament.setCreated_at(currentDate);
        testTournament.setUpdated_at(currentDate);
        testTournament.setGame(testGame);
        testTournament.setTeams(new HashSet<>());

        // Setup test team
        testTeam = new Teams();
        testTeam.setId(1L);
        testTeam.setName("Test Team");
        testTeam.setLocation("Test Location");
        testTeam.setCreated_at(currentDate);
        testTeam.setUpdated_at(currentDate);
    }

    @Test
    void createTournament_Success() {
        // Arrange
        when(tournamentService.createTournament(any(Tournament.class))).thenReturn(testTournament);
        when(gameRepository.findById(anyLong())).thenReturn(Optional.of(testGame));
        MockHttpServletRequest request = new MockHttpServletRequest();

        // Act
        ResponseEntity<?> response = tournamentController.createTournament(testTournament, request);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    void listTournaments_Success() {
        // Arrange
        Page<Tournament> tournamentPage = new PageImpl<>(Collections.singletonList(testTournament));
        when(tournamentService.listTournaments(any(Pageable.class))).thenReturn(tournamentPage);

        // Act
        ResponseEntity<?> response = tournamentController.listTournaments(PageRequest.of(0, 10));

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    void findATournament_Success() {
        // Arrange
        when(tournamentService.findATournament(anyLong())).thenReturn(testTournament);

        // Act
        ResponseEntity<?> response = tournamentController.findATournament("1");

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    void updateTournament_Success() {
        // Arrange
        when(tournamentService.updateTournament(anyLong(), any(Tournament.class))).thenReturn(testTournament);
        when(gameRepository.findById(anyLong())).thenReturn(Optional.of(testGame));

        // Act
        ResponseEntity<?> response = tournamentController.updateTournament("1", testTournament);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    void deleteTournament_Success() {
        // Arrange
        doNothing().when(tournamentService).deleteTournament(anyLong());

        // Act
        ResponseEntity<?> response = tournamentController.deleteTournament("1");

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
    }

    @Test
    void addTeamToTournament_Success() {
        // Arrange
        when(tournamentService.addTeamToTournament(anyLong(), anyLong())).thenReturn(testTournament);

        // Act
        ResponseEntity<?> response = tournamentController.addTeamToTournament("1", "1");

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    void removeTeamFromTournament_Success() {
        // Arrange
        doNothing().when(tournamentService).removeTeamFromTournament(anyLong(), anyLong());

        // Act
        ResponseEntity<?> response = tournamentController.removeTeamFromTournament("1", "1");

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void getTeamsInTournament_Success() {
        // Arrange
        List<Teams> teamsList = Collections.singletonList(testTeam);
        Page<Teams> teamsPage = new PageImpl<>(teamsList);
        when(tournamentService.listTeamsInTournament(anyLong(), any(Pageable.class))).thenReturn(teamsPage);

        // Act
        ResponseEntity<?> response = tournamentController.getTeamsInTournament("1", PageRequest.of(0, 10));

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    void searchTournaments_Success() {
        // Arrange
        Page<Tournament> tournamentPage = new PageImpl<>(Collections.singletonList(testTournament));
        when(tournamentService.findByNameContaining(anyString(), any(Pageable.class))).thenReturn(tournamentPage);

        // Act
        ResponseEntity<?> response = tournamentController.searchTournaments("Test", PageRequest.of(0, 10));

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    void getActiveTournaments_Success() {
        // Arrange
        Page<Tournament> tournamentPage = new PageImpl<>(Collections.singletonList(testTournament));
        when(tournamentService.findActiveTournaments(any(Date.class), any(Pageable.class))).thenReturn(tournamentPage);

        // Act
        ResponseEntity<?> response = tournamentController.getActiveTournaments(PageRequest.of(0, 10));

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }
} 