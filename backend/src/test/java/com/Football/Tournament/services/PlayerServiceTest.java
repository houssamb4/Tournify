package com.Football.Tournament.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import javax.persistence.EntityManager;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.ActiveProfiles;

import com.Football.Tournament.dao.PlayerDao;
import com.Football.Tournament.dao.TeamDao;
import com.Football.Tournament.entities.Players;
import com.Football.Tournament.entities.Teams;
import com.Football.Tournament.exception.ResourceNotFoundException;

/**
 * Test class for PlayerService
 * Uses Mockito to mock dependencies and test service logic
 */
@SpringBootTest
@ActiveProfiles("test")
public class PlayerServiceTest {

    @Mock
    private PlayerDao playerDao;
    
    @Mock
    private TeamDao teamDao;
    
    @Mock
    private EntityManager entityManager;
    
    @InjectMocks
    private PlayerServiceImpl playerService;
    
    private Players mockPlayer;
    private Teams mockTeam;
    
    @BeforeEach
    public void setup() {
        // Setup mock team
        mockTeam = new Teams();
        mockTeam.setId(1L);
        mockTeam.setName("Mock Team");
        mockTeam.setLocation("Mock Location");
        mockTeam.setLogoUrl("Mock Logo URL");
        mockTeam.setCreated_at(new Date());
        mockTeam.setUpdated_at(new Date());
        
        // Setup mock player
        mockPlayer = new Players();
        mockPlayer.setId(1L); // Mock ID for testing - in real app, this would be auto-generated
        mockPlayer.setName("Mock Player");
        mockPlayer.setAge(28);
        mockPlayer.setTeam(mockTeam);
        mockPlayer.setTeam_id(mockTeam.getId());
        mockPlayer.setCreated_at(new Date());
        mockPlayer.setUpdated_at(new Date());
    }
    
    @Test
    public void testCreatePlayer() {
        // Note: This test accounts for the workaround in PlayerServiceImpl
        // for the auto-increment issue mentioned in the memory
        
        // Given
        when(teamDao.findById(mockTeam.getId())).thenReturn(Optional.of(mockTeam));
        when(entityManager.createNativeQuery(anyString())).thenReturn(mock(javax.persistence.Query.class));
        when(entityManager.createNativeQuery(anyString()).getSingleResult()).thenReturn(0L); // Mock max ID result
        when(entityManager.createNativeQuery(anyString()).setParameter(anyInt(), any())).thenReturn(mock(javax.persistence.Query.class));
        when(entityManager.createNativeQuery(anyString()).setParameter(anyInt(), any()).setParameter(anyInt(), any())).thenReturn(mock(javax.persistence.Query.class));
        when(entityManager.createNativeQuery(anyString()).setParameter(anyInt(), any()).setParameter(anyInt(), any()).setParameter(anyInt(), any())).thenReturn(mock(javax.persistence.Query.class));
        when(entityManager.createNativeQuery(anyString()).setParameter(anyInt(), any()).setParameter(anyInt(), any()).setParameter(anyInt(), any()).setParameter(anyInt(), any())).thenReturn(mock(javax.persistence.Query.class));
        when(entityManager.createNativeQuery(anyString()).setParameter(anyInt(), any()).setParameter(anyInt(), any()).setParameter(anyInt(), any()).setParameter(anyInt(), any()).setParameter(anyInt(), any())).thenReturn(mock(javax.persistence.Query.class));
        when(entityManager.createNativeQuery(anyString()).setParameter(anyInt(), any()).setParameter(anyInt(), any()).setParameter(anyInt(), any()).setParameter(anyInt(), any()).setParameter(anyInt(), any()).setParameter(anyInt(), any())).thenReturn(mock(javax.persistence.Query.class));
        when(entityManager.createNativeQuery(anyString()).setParameter(anyInt(), any()).setParameter(anyInt(), any()).setParameter(anyInt(), any()).setParameter(anyInt(), any()).setParameter(anyInt(), any()).setParameter(anyInt(), any()).setParameter(anyInt(), any())).thenReturn(mock(javax.persistence.Query.class));
        when(entityManager.createNativeQuery(anyString()).setParameter(anyInt(), any()).setParameter(anyInt(), any()).setParameter(anyInt(), any()).setParameter(anyInt(), any()).setParameter(anyInt(), any()).setParameter(anyInt(), any()).setParameter(anyInt(), any()).executeUpdate()).thenReturn(1);
        
        // When
        Players createdPlayer = playerService.createPlayer(mockPlayer);
        
        // Then
        assertNotNull(createdPlayer);
        assertEquals(mockPlayer.getId(), createdPlayer.getId());
        assertEquals(mockPlayer.getName(), createdPlayer.getName());
        assertEquals(mockPlayer.getTeam().getId(), createdPlayer.getTeam().getId());
        
        // Verify interactions
        verify(teamDao, times(1)).findById(mockTeam.getId());
        verify(entityManager, times(1)).createNativeQuery(contains("SELECT COALESCE(MAX(id), 0) FROM players"));
        verify(entityManager, times(1)).createNativeQuery(contains("INSERT INTO players"));
    }
    
    @Test
    public void testCreatePlayerWithInvalidTeam() {
        // Given
        when(teamDao.findById(mockTeam.getId())).thenReturn(Optional.empty());
        
        // When/Then
        assertThrows(IllegalArgumentException.class, () -> {
            playerService.createPlayer(mockPlayer);
        });
        
        // Verify interactions
        verify(teamDao, times(1)).findById(mockTeam.getId());
        verify(playerDao, never()).save(any(Players.class));
    }
    
    @Test
    public void testFindAPlayer() {
        // Given
        when(playerDao.findById(mockPlayer.getId())).thenReturn(Optional.of(mockPlayer));
        
        // When
        Players foundPlayer = playerService.findAPlayer(mockPlayer.getId());
        
        // Then
        assertNotNull(foundPlayer);
        assertEquals(mockPlayer.getId(), foundPlayer.getId());
        assertEquals(mockPlayer.getName(), foundPlayer.getName());
        
        // Verify interactions
        verify(playerDao, times(1)).findById(mockPlayer.getId());
    }
    
    @Test
    public void testFindAPlayerNotFound() {
        // Given
        when(playerDao.findById(999L)).thenReturn(Optional.empty());
        
        // When/Then
        assertThrows(RuntimeException.class, () -> {
            playerService.findAPlayer(999L);
        });
        
        // Verify interactions
        verify(playerDao, times(1)).findById(999L);
    }
    
    @Test
    public void testUpdatePlayer() {
        // Given
        Players updatedPlayer = new Players();
        updatedPlayer.setId(mockPlayer.getId());
        updatedPlayer.setName("Updated Name");
        updatedPlayer.setAge(30);
        updatedPlayer.setTeam_id(mockTeam.getId());
        
        when(playerDao.findById(mockPlayer.getId())).thenReturn(Optional.of(mockPlayer));
        when(teamDao.findById(mockTeam.getId())).thenReturn(Optional.of(mockTeam));
        when(playerDao.save(any(Players.class))).thenReturn(updatedPlayer);
        
        // When
        Players result = playerService.updatePlayer(mockPlayer.getId(), updatedPlayer);
        
        // Then
        assertNotNull(result);
        assertEquals(updatedPlayer.getName(), result.getName());
        assertEquals(updatedPlayer.getAge(), result.getAge());
        
        // Verify interactions
        verify(playerDao, times(1)).findById(mockPlayer.getId());
        verify(teamDao, times(1)).findById(mockTeam.getId());
        verify(playerDao, times(1)).save(any(Players.class));
    }
    
    @Test
    public void testPlayersByTeamId() {
        // Given
        List<Players> playersList = new ArrayList<>();
        playersList.add(mockPlayer);
        
        when(playerDao.findByTeamId(mockTeam.getId())).thenReturn(playersList);
        
        // When
        List<Players> result = playerService.playersByTeamId(mockTeam.getId());
        
        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(mockPlayer.getId(), result.get(0).getId());
        
        // Verify interactions
        verify(playerDao, times(1)).findByTeamId(mockTeam.getId());
    }
    
    @Test
    public void testDeletePlayer() {
        // Given
        when(playerDao.findById(mockPlayer.getId())).thenReturn(Optional.of(mockPlayer));
        doNothing().when(playerDao).delete(mockPlayer);
        
        // When
        playerService.deletePlayer(mockPlayer.getId());
        
        // Verify interactions
        verify(playerDao, times(1)).findById(mockPlayer.getId());
        verify(playerDao, times(1)).delete(mockPlayer);
    }
    
    @Test
    public void testDeletePlayerByTeamId() {
        // Given
        List<Players> mockPlayers = Arrays.asList(mockPlayer);
        when(playerDao.findByTeamId(mockTeam.getId())).thenReturn(mockPlayers);
        doNothing().when(playerDao).deleteAll(mockPlayers);
        
        // When
        playerService.deletePlayerByTeamId(mockTeam.getId());
        
        // Verify interactions
        verify(playerDao, times(1)).findByTeamId(mockTeam.getId());
        verify(playerDao, times(1)).deleteAll(mockPlayers);
    }
}
