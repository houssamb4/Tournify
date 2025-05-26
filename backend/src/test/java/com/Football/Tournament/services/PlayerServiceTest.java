package com.Football.Tournament.services;

import com.Football.Tournament.dao.PlayerDao;
import com.Football.Tournament.dao.TeamDao;
import com.Football.Tournament.entities.Players;
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

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class PlayerServiceTest {

    @Mock
    private PlayerDao playerDao;

    @Mock
    private TeamDao teamDao;

    @Mock
    private EntityManager entityManager;

    @Mock
    private Query query;

    @InjectMocks
    private PlayerServiceImpl playerService;

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
        when(teamDao.findById(anyLong())).thenReturn(Optional.of(testTeam));
        when(entityManager.createNativeQuery(anyString())).thenReturn(query);
        when(query.getSingleResult()).thenReturn(1L);
        when(query.setParameter(anyInt(), any())).thenReturn(query);
        when(query.executeUpdate()).thenReturn(1);

        // Act
        Players createdPlayer = playerService.createPlayer(testPlayer);

        // Assert
        assertNotNull(createdPlayer);
        assertEquals(testPlayer.getName(), createdPlayer.getName());
        assertEquals(testPlayer.getAge(), createdPlayer.getAge());
        assertEquals(testPlayer.getTeam().getId(), createdPlayer.getTeam().getId());
        verify(entityManager, times(2)).createNativeQuery(anyString());
        verify(query, times(7)).setParameter(anyInt(), any());
        verify(query).executeUpdate();
    }

    @Test
    void listPlayers_Success() {
        // Arrange
        List<Players> playersList = new ArrayList<>();
        playersList.add(testPlayer);
        Page<Players> playersPage = new PageImpl<>(playersList);
        Pageable pageable = PageRequest.of(0, 10);
        
        when(playerDao.findAll(any(Pageable.class))).thenReturn(playersPage);

        // Act
        Page<Players> result = playerService.listPlayers(pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(testPlayer.getName(), result.getContent().get(0).getName());
        verify(playerDao).findAll(any(Pageable.class));
    }

    @Test
    void findAPlayer_Success() {
        // Arrange
        when(playerDao.findById(anyLong())).thenReturn(Optional.of(testPlayer));

        // Act
        Players foundPlayer = playerService.findAPlayer(1L);

        // Assert
        assertNotNull(foundPlayer);
        assertEquals(testPlayer.getName(), foundPlayer.getName());
        assertEquals(testPlayer.getAge(), foundPlayer.getAge());
        verify(playerDao).findById(anyLong());
    }

    @Test
    void updatePlayer_Success() {
        // Arrange
        Players updatedPlayer = new Players();
        updatedPlayer.setId(1L);
        updatedPlayer.setName("Updated Name");
        updatedPlayer.setAge(26);
        updatedPlayer.setTeam(testTeam);

        when(playerDao.findById(anyLong())).thenReturn(Optional.of(testPlayer));
        when(teamDao.findById(anyLong())).thenReturn(Optional.of(testTeam));
        when(playerDao.save(any(Players.class))).thenReturn(updatedPlayer);

        // Act
        Players result = playerService.updatePlayer(1L, updatedPlayer);

        // Assert
        assertNotNull(result);
        assertEquals(updatedPlayer.getName(), result.getName());
        assertEquals(updatedPlayer.getAge(), result.getAge());
        verify(playerDao).findById(anyLong());
        verify(playerDao).save(any(Players.class));
    }

    @Test
    void deletePlayer_Success() {
        // Arrange
        when(playerDao.findById(anyLong())).thenReturn(Optional.of(testPlayer));
        doNothing().when(playerDao).delete(any(Players.class));

        // Act
        playerService.deletePlayer(1L);

        // Assert
        verify(playerDao).findById(anyLong());
        verify(playerDao).delete(any(Players.class));
    }

    @Test
    void playersByTeamId_Success() {
        // Arrange
        List<Players> teamPlayers = new ArrayList<>();
        teamPlayers.add(testPlayer);
        when(playerDao.findByTeamId(anyLong())).thenReturn(teamPlayers);

        // Act
        List<Players> result = playerService.playersByTeamId(1L);

        // Assert
        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        assertEquals(testPlayer.getName(), result.get(0).getName());
        verify(playerDao).findByTeamId(anyLong());
    }
}