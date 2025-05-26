package com.Football.Tournament.services;

import com.Football.Tournament.dao.TeamDao;
import com.Football.Tournament.dao.TournamentDao;
import com.Football.Tournament.entities.Teams;
import com.Football.Tournament.entities.Tournament;
import com.Football.Tournament.entities.Game;
import com.Football.Tournament.exception.ResourceNotFoundException;
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
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class TournamentServiceTest {

    @Mock
    private TournamentDao tournamentDao;

    @Mock
    private TeamDao teamDao;

    @Mock
    private TeamService teamService;

    @InjectMocks
    private TournamentServiceImpl tournamentService;

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
        when(tournamentDao.save(any(Tournament.class))).thenReturn(testTournament);
        when(tournamentDao.findByNameContaining(anyString(), any(Pageable.class)))
            .thenReturn(new PageImpl<>(Collections.emptyList()));

        // Act
        Tournament createdTournament = tournamentService.createTournament(testTournament);

        // Assert
        assertNotNull(createdTournament);
        assertEquals(testTournament.getName(), createdTournament.getName());
        assertEquals(testTournament.getLogoUrl(), createdTournament.getLogoUrl());
        verify(tournamentDao).save(any(Tournament.class));
    }

    @Test
    void createTournament_WithInvalidDates_ThrowsException() {
        // Arrange
        testTournament.setStartDate(new Date(currentDate.getTime() + 86400000));  // Tomorrow
        testTournament.setEndDate(new Date(currentDate.getTime() - 86400000));    // Yesterday
        when(tournamentDao.findByNameContaining(anyString(), any(Pageable.class)))
            .thenReturn(new PageImpl<>(Collections.emptyList()));

        // Act & Assert
        Exception exception = assertThrows(RuntimeException.class, () -> {
            tournamentService.createTournament(testTournament);
        });
        assertEquals("Failed to create tournament: End date must be after start date", exception.getMessage());
    }

    @Test
    void listTournaments_Success() {
        // Arrange
        List<Tournament> tournamentList = Collections.singletonList(testTournament);
        Page<Tournament> tournamentPage = new PageImpl<>(tournamentList);
        Pageable pageable = PageRequest.of(0, 10);
        when(tournamentDao.findAll(any(Pageable.class))).thenReturn(tournamentPage);

        // Act
        Page<Tournament> result = tournamentService.listTournaments(pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(testTournament.getName(), result.getContent().get(0).getName());
    }

    @Test
    void findATournament_Success() {
        // Arrange
        when(tournamentDao.findById(anyLong())).thenReturn(Optional.of(testTournament));

        // Act
        Tournament foundTournament = tournamentService.findATournament(1L);

        // Assert
        assertNotNull(foundTournament);
        assertEquals(testTournament.getName(), foundTournament.getName());
    }

    @Test
    void findATournament_NotFound_ThrowsException() {
        // Arrange
        when(tournamentDao.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        Exception exception = assertThrows(RuntimeException.class, () -> {
            tournamentService.findATournament(1L);
        });
        assertEquals("Tournament not found with id: 1", exception.getMessage());
    }

    @Test
    void updateTournament_Success() {
        // Arrange
        Tournament updatedTournament = new Tournament();
        updatedTournament.setId(1L);
        updatedTournament.setName("Updated Tournament");
        updatedTournament.setLogoUrl("http://example.com/updated-logo.png");
        
        when(tournamentDao.findById(anyLong())).thenReturn(Optional.of(testTournament));
        when(tournamentDao.save(any(Tournament.class))).thenReturn(updatedTournament);

        // Act
        Tournament result = tournamentService.updateTournament(1L, updatedTournament);

        // Assert
        assertNotNull(result);
        assertEquals(updatedTournament.getName(), result.getName());
        assertEquals(updatedTournament.getLogoUrl(), result.getLogoUrl());
    }

    @Test
    void deleteTournament_Success() {
        // Arrange
        when(tournamentDao.findById(anyLong())).thenReturn(Optional.of(testTournament));
        doNothing().when(tournamentDao).delete(any(Tournament.class));

        // Act & Assert
        assertDoesNotThrow(() -> tournamentService.deleteTournament(1L));
        verify(tournamentDao).delete(any(Tournament.class));
    }

    @Test
    void addTeamToTournament_Success() {
        // Arrange
        when(tournamentDao.findById(anyLong())).thenReturn(Optional.of(testTournament));
        when(teamDao.findById(anyLong())).thenReturn(Optional.of(testTeam));
        when(tournamentDao.save(any(Tournament.class))).thenReturn(testTournament);

        // Act
        Tournament result = tournamentService.addTeamToTournament(1L, 1L);

        // Assert
        assertNotNull(result);
        verify(tournamentDao).save(any(Tournament.class));
    }

    @Test
    void removeTeamFromTournament_Success() {
        // Arrange
        testTournament.addTeam(testTeam);
        when(tournamentDao.findById(anyLong())).thenReturn(Optional.of(testTournament));
        when(teamDao.findById(anyLong())).thenReturn(Optional.of(testTeam));
        when(tournamentDao.save(any(Tournament.class))).thenReturn(testTournament);

        // Act & Assert
        assertDoesNotThrow(() -> tournamentService.removeTeamFromTournament(1L, 1L));
        verify(tournamentDao).save(any(Tournament.class));
    }

    @Test
    void listTeamsInTournament_Success() {
        // Arrange
        List<Teams> teamsList = Collections.singletonList(testTeam);
        Page<Teams> teamsPage = new PageImpl<>(teamsList);
        Pageable pageable = PageRequest.of(0, 10);
        when(teamDao.findByTournamentsId(anyLong(), any(Pageable.class))).thenReturn(teamsPage);

        // Act
        Page<Teams> result = tournamentService.listTeamsInTournament(1L, pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(testTeam.getName(), result.getContent().get(0).getName());
    }

    @Test
    void findByNameContaining_Success() {
        // Arrange
        List<Tournament> tournamentList = Collections.singletonList(testTournament);
        Page<Tournament> tournamentPage = new PageImpl<>(tournamentList);
        Pageable pageable = PageRequest.of(0, 10);
        when(tournamentDao.findByNameContaining(anyString(), any(Pageable.class))).thenReturn(tournamentPage);

        // Act
        Page<Tournament> result = tournamentService.findByNameContaining("Test", pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(testTournament.getName(), result.getContent().get(0).getName());
    }

    @Test
    void findActiveTournaments_Success() {
        // Arrange
        List<Tournament> tournamentList = Collections.singletonList(testTournament);
        Page<Tournament> tournamentPage = new PageImpl<>(tournamentList);
        Pageable pageable = PageRequest.of(0, 10);
        when(tournamentDao.findByStartDateLessThanEqualAndEndDateGreaterThanEqual(
            any(Date.class), any(Date.class), any(Pageable.class))).thenReturn(tournamentPage);

        // Act
        Page<Tournament> result = tournamentService.findActiveTournaments(currentDate, pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertTrue(result.getContent().get(0).getStartDate().before(currentDate) || 
                  result.getContent().get(0).getStartDate().equals(currentDate));
        assertTrue(result.getContent().get(0).getEndDate().after(currentDate) || 
                  result.getContent().get(0).getEndDate().equals(currentDate));
    }
}