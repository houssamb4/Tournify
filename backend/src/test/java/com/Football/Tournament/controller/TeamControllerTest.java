package com.Football.Tournament.controller;

import com.Football.Tournament.entities.Teams;
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

import java.util.Collections;
import java.util.Date;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class TeamControllerTest {

    @Mock
    private TeamService teamService;

    @InjectMocks
    private TeamController teamController;

    private Teams testTeam;

    @BeforeEach
    void setUp() {
        testTeam = new Teams();
        testTeam.setId(1L);
        testTeam.setName("Test Team");
        testTeam.setLocation("Test Location");
        testTeam.setLogoUrl("http://example.com/logo.png");
        testTeam.setCreated_at(new Date());
        testTeam.setUpdated_at(new Date());
    }

    @Test
    void createTeam_Success() {
        // Arrange
        when(teamService.createTeam(any(Teams.class))).thenReturn(testTeam);

        // Act
        ResponseEntity<?> response = teamController.createTeam(testTeam);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    void listTeams_Success() {
        // Arrange
        Page<Teams> teamPage = new PageImpl<>(Collections.singletonList(testTeam));
        when(teamService.listTeams(any(Pageable.class))).thenReturn(teamPage);

        // Act
        ResponseEntity<?> response = teamController.listTeams(PageRequest.of(0, 10));

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    void findATeam_Success() {
        // Arrange
        when(teamService.findATeam(anyLong())).thenReturn(testTeam);

        // Act
        ResponseEntity<?> response = teamController.findATeam(1L);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    void updateTeam_Success() {
        // Arrange
        when(teamService.updateTeam(anyLong(), any(Teams.class))).thenReturn(testTeam);

        // Act
        ResponseEntity<?> response = teamController.updateTeam(1L, testTeam);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    void deleteTeam_Success() {
        // Act
        ResponseEntity<?> response = teamController.deleteTeam(1L);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
    }
} 