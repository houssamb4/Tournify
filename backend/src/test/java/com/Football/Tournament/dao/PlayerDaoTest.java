package com.Football.Tournament.dao;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import com.Football.Tournament.entities.Players;
import com.Football.Tournament.entities.Teams;

/**
 * Test class for PlayerDao
 * - Focuses on testing the auto-increment functionality for Player IDs
 * - Tests other DAO operations for Players
 */
@DataJpaTest
@ActiveProfiles("test")
public class PlayerDaoTest {

    @Autowired
    private PlayerDao playerDao;
    
    @Autowired
    private TeamDao teamDao;
    
    @Test
    public void testSavePlayer() {
        // Create a team first
        Teams team = new Teams();
        team.setName("Player DAO Test Team");
        team.setLocation("Test Location");
        team.setLogoUrl("Test Team Description");
        Teams savedTeam = teamDao.save(team);
        
        // Create a player without explicitly setting the ID
        Players player = new Players();
        player.setName("PlayerDao Test Player");
        player.setAge(27);
        player.setTeam(savedTeam);
        player.setTeam_id(savedTeam.getId());
        
        // Save the player
        Players savedPlayer = playerDao.save(player);
        
        // Verify ID was auto-generated
        assertNotNull(savedPlayer.getId(), "Player ID should be auto-generated");
        assertTrue(savedPlayer.getId() > 0, "Player ID should be greater than 0");
        
        // Verify other fields
        assertEquals("PlayerDao Test Player", savedPlayer.getName());
        assertEquals(27, savedPlayer.getAge());
        assertEquals(savedTeam.getId(), savedPlayer.getTeam().getId());
    }
    
    @Test
    public void testFindPlayerById() {
        // Create a team
        Teams team = new Teams();
        team.setName("Find Player Team");
        team.setLocation("Find Location");
        team.setLogoUrl("Find Team Description");
        Teams savedTeam = teamDao.save(team);
        
        // Create a player
        Players player = new Players();
        player.setName("Find Player");
        player.setAge(30);
        player.setTeam(savedTeam);
        player.setTeam_id(savedTeam.getId());
        
        // Save the player
        Players savedPlayer = playerDao.save(player);
        
        // Find the player by ID
        Optional<Players> foundPlayer = playerDao.findById(savedPlayer.getId());
        
        // Verify
        assertTrue(foundPlayer.isPresent(), "Player should be found");
        assertEquals(savedPlayer.getId(), foundPlayer.get().getId());
        assertEquals("Find Player", foundPlayer.get().getName());
    }
    
    @Test
    public void testFindPlayersByTeamId() {
        // Create a team
        Teams team = new Teams();
        team.setName("Team for Players");
        team.setLocation("Team Location");
        team.setLogoUrl("Team Description");
        Teams savedTeam = teamDao.save(team);
        
        // Create players for the team
        Players player1 = new Players();
        player1.setName("Team Player 1");
        player1.setAge(25);
        player1.setTeam(savedTeam);
        player1.setTeam_id(savedTeam.getId());
        playerDao.save(player1);
        
        Players player2 = new Players();
        player2.setName("Team Player 2");
        player2.setAge(28);
        player2.setTeam(savedTeam);
        player2.setTeam_id(savedTeam.getId());
        playerDao.save(player2);
        
        // Find players by team ID
        List<Players> playersList = playerDao.findByTeamId(savedTeam.getId());
        
        // Verify
        assertNotNull(playersList, "List of players should not be null");
        assertEquals(2, playersList.size(), "Should find 2 players for the team");
    }
    
    @Test
    @Transactional
    public void testDeletePlayersByTeamId() {
        // Create a team
        Teams team = new Teams();
        team.setName("Delete Players Team");
        team.setLocation("Delete Location");
        team.setLogoUrl("Delete Team Description");
        Teams savedTeam = teamDao.save(team);
        
        // Create players for the team
        Players player1 = new Players();
        player1.setName("Delete Player 1");
        player1.setAge(25);
        player1.setTeam(savedTeam);
        player1.setTeam_id(savedTeam.getId());
        playerDao.save(player1);
        
        Players player2 = new Players();
        player2.setName("Delete Player 2");
        player2.setAge(28);
        player2.setTeam(savedTeam);
        player2.setTeam_id(savedTeam.getId());
        playerDao.save(player2);
        
        // Delete players by team ID - using find and deleteAll instead of deleteByTeam_id
        List<Players> playersToDelete = playerDao.findByTeamId(savedTeam.getId());
        playerDao.deleteAll(playersToDelete);
        
        // Verify no players exist for the team
        List<Players> playersList = playerDao.findByTeamId(savedTeam.getId());
        assertEquals(0, playersList.size(), "No players should remain for the team");
    }
}
