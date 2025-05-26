package com.Football.Tournament.services;

import com.Football.Tournament.dao.PlayerDao;
import com.Football.Tournament.dao.TeamDao;
import com.Football.Tournament.entities.Teams;
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

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class TeamServiceTest {

    @Mock
    private TeamDao teamDao;

    @Mock
    private PlayerDao playerDao;

    @InjectMocks
    private TeamServiceImpl teamService;

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
        when(teamDao.save(any(Teams.class))).thenReturn(testTeam);

        // Act
        Teams createdTeam = teamService.createTeam(testTeam);

        // Assert
        assertNotNull(createdTeam);
        assertEquals(testTeam.getName(), createdTeam.getName());
        assertEquals(testTeam.getLocation(), createdTeam.getLocation());
        assertEquals(testTeam.getLogoUrl(), createdTeam.getLogoUrl());
    }

    @Test
    void listTeams_Success() {
        // Arrange
        List<Teams> teamsList = new ArrayList<>();
        teamsList.add(testTeam);
        Page<Teams> teamsPage = new PageImpl<>(teamsList);
        Pageable pageable = PageRequest.of(0, 10);

        when(teamDao.findAll(any(Pageable.class))).thenReturn(teamsPage);

        // Act
        Page<Teams> result = teamService.listTeams(pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(testTeam.getName(), result.getContent().get(0).getName());
    }

    @Test
    void findATeam_Success() {
        // Arrange
        when(teamDao.findById(anyLong())).thenReturn(Optional.of(testTeam));

        // Act
        Teams foundTeam = teamService.findATeam(1L);

        // Assert
        assertNotNull(foundTeam);
        assertEquals(testTeam.getName(), foundTeam.getName());
        assertEquals(testTeam.getLocation(), foundTeam.getLocation());
    }

    @Test
    void updateTeam_Success() {
        // Arrange
        Teams updatedTeam = new Teams();
        updatedTeam.setId(1L);
        updatedTeam.setName("Updated Team Name");
        updatedTeam.setLocation("Updated Location");
        updatedTeam.setLogoUrl("http://example.com/updated-logo.png");

        when(teamDao.findById(anyLong())).thenReturn(Optional.of(testTeam));
        when(teamDao.save(any(Teams.class))).thenReturn(updatedTeam);

        // Act
        Teams result = teamService.updateTeam(1L, updatedTeam);

        // Assert
        assertNotNull(result);
        assertEquals(updatedTeam.getName(), result.getName());
        assertEquals(updatedTeam.getLocation(), result.getLocation());
        assertEquals(updatedTeam.getLogoUrl(), result.getLogoUrl());
    }

    @Test
    void deleteTeam_Success() {
        // Arrange
        when(teamDao.findById(anyLong())).thenReturn(Optional.of(testTeam));
        doNothing().when(teamDao).delete(any(Teams.class));
        doNothing().when(playerDao).deleteByTeam_id(anyLong());

        // Act & Assert
        assertDoesNotThrow(() -> teamService.deleteTeam(1L));
        verify(teamDao, times(1)).delete(any(Teams.class));
        verify(playerDao, times(1)).deleteByTeam_id(anyLong());
    }
} 