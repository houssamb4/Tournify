package com.Football.Tournament.entities;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Date;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import com.Football.Tournament.BaseTest;

/**
 * Test class for Players entity
 * Addresses the auto-increment issue mentioned for Players entity
 */
@DataJpaTest
@ActiveProfiles("test")
public class PlayersTest {

    @Autowired
    private TestEntityManager entityManager;

    @Test
    public void testCreatePlayer() {
        // Create a test team first
        Teams team = new Teams();
        team.setName("Test Team");
        team.setLocation("Test Location");
        team.setLogoUrl("Test Team Description");
        team.setCreated_at(new Date());
        team.setUpdated_at(new Date());
        entityManager.persist(team);
        entityManager.flush();

        // Create a player connected to the team
        Players player = new Players();
        player.setName("Test Player");
        player.setAge(25);
        player.setTeam(team);
        player.setTeam_id(team.getId()); // Set the team_id for the transient field
        
        // Note: ID should be auto-generated, but we're not setting it here due to the known issue
        // The H2 database should handle the auto-increment properly in test environment
        
        // Test persist
        Players savedPlayer = entityManager.persistAndFlush(player);
        
        // Assert
        assertNotNull(savedPlayer.getId(), "Player ID should be auto-generated");
        assertEquals("Test Player", savedPlayer.getName());
        assertEquals(25, savedPlayer.getAge());
        assertNotNull(savedPlayer.getCreated_at(), "Created date should be set");
        assertNotNull(savedPlayer.getUpdated_at(), "Updated date should be set");
        assertEquals(team.getId(), savedPlayer.getTeam().getId(), "Team reference should be set correctly");
    }
    
    @Test
    public void testPlayerPrePersistHook() {
        // Create a test team first
        Teams team = new Teams();
        team.setName("Another Test Team");
        team.setLocation("Another Test Location");
        team.setLogoUrl("Another Test Team Description");
        team.setCreated_at(new Date());
        team.setUpdated_at(new Date());
        entityManager.persist(team);
        entityManager.flush();
        
        // Create a player without setting created_at and updated_at
        Players player = new Players();
        player.setName("Auto Date Player");
        player.setAge(30);
        player.setTeam(team);
        player.setTeam_id(team.getId());
        
        // Test that dates are automatically set by @PrePersist
        Players savedPlayer = entityManager.persistAndFlush(player);
        
        // Assert
        assertNotNull(savedPlayer.getCreated_at(), "Created date should be automatically set");
        assertNotNull(savedPlayer.getUpdated_at(), "Updated date should be automatically set");
        assertEquals(savedPlayer.getCreated_at(), savedPlayer.getUpdated_at(), 
                "Created and updated dates should be the same on creation");
    }
}
