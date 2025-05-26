package com.Football.Tournament.controller;

import com.Football.Tournament.entities.Players;
import com.Football.Tournament.entities.Teams;
import com.Football.Tournament.services.PlayerService;
import com.Football.Tournament.services.TeamService;
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
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class ControllerTest {

    @Mock
    private TeamService teamService;

    @Mock
    private PlayerService playerService;

    @InjectMocks
    private Controller controller;

    private Teams testTeam;
    private Players testPlayer;
    private Date currentDate;

    @BeforeEach
    void setUp() {
        currentDate = new Date();

        testTeam = new Teams();
        testTeam.setId(1L);
        testTeam.setName("Test Team");
        testTeam.setLocation("Test Location");
        testTeam.setCreated_at(currentDate);
        testTeam.setUpdated_at(currentDate);

        testPlayer = new Players();
        testPlayer.setId(1L);
        testPlayer.setName("Test Player");
        testPlayer.setAge(25);
        testPlayer.setTeam(testTeam);
        testPlayer.setTeam_id(testTeam.getId());
        testPlayer.setCreated_at(currentDate);
        testPlayer.setUpdated_at(currentDate);
    }

    @Test
    void listTeams_Success() {
        // Arrange
        Page<Teams> teamsPage = new PageImpl<>(Collections.singletonList(testTeam));
        Pageable pageable = PageRequest.of(0, 3);
        when(teamService.listTeams(any(Pageable.class))).thenReturn(teamsPage);

        // Act
        ResponseEntity<Object> response = controller.listTeams(pageable);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void createTeam_Success() {
        // Arrange
        MockHttpServletRequest request = new MockHttpServletRequest();
        when(teamService.createTeam(any(Teams.class))).thenReturn(testTeam);

        // Act
        ResponseEntity<Object> response = controller.createTeam(testTeam, request);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void findATeam_Success() {
        // Arrange
        when(teamService.findATeam(anyLong())).thenReturn(testTeam);

        // Act
        ResponseEntity<Object> response = controller.findATeam("1");

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void updateTeam_Success() {
        // Arrange
        when(teamService.updateTeam(anyLong(), any(Teams.class))).thenReturn(testTeam);

        // Act
        ResponseEntity<Object> response = controller.updateTeam("1", testTeam);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void deleteTeam_Success() {
        // Act
        ResponseEntity<Object> response = controller.deleteTeam("1");

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void listPlayers_Success() {
        // Arrange
        Page<Players> playersPage = new PageImpl<>(Collections.singletonList(testPlayer));
        Pageable pageable = PageRequest.of(0, 3);
        when(playerService.listPlayers(any(Pageable.class))).thenReturn(playersPage);

        // Act
        ResponseEntity<Object> response = controller.listPlayers(pageable);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void createPlayer_Success() {
        // Arrange
        MockHttpServletRequest request = new MockHttpServletRequest();
        when(playerService.createPlayer(any(Players.class))).thenReturn(testPlayer);

        // Act
        ResponseEntity<Object> response = controller.createPlayer(testPlayer, request);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
    }

    @Test
    void findAPlayer_Success() {
        // Arrange
        when(playerService.findAPlayer(anyLong())).thenReturn(testPlayer);

        // Act
        ResponseEntity<Object> response = controller.findAPlayer("1");

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void updatePlayer_Success() {
        // Arrange
        when(playerService.updatePlayer(anyLong(), any(Players.class))).thenReturn(testPlayer);

        // Act
        ResponseEntity<Object> response = controller.updatePlayer("1", testPlayer);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void deletePlayer_Success() {
        // Act
        ResponseEntity<Object> response = controller.deletePlayer("1");

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void playersByTeamId_Success() {
        // Arrange
        List<Players> players = Collections.singletonList(testPlayer);
        when(playerService.playersByTeamId(anyLong())).thenReturn(players);

        // Act
        ResponseEntity<Object> response = controller.playersByTeamId("1");

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }
} 