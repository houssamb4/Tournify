package com.Football.Tournament.entities;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Date;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

/**
 * Test class for Teams entity
 */
@DataJpaTest
@ActiveProfiles("test")
public class TeamsTest {

    @Autowired
    private TestEntityManager entityManager;

    @Test
    public void testCreateTeam() {
        // Create a team
        Teams team = new Teams();
        team.setName("Test Team");
        team.setLocation("Test Location");
        team.setLogoUrl("Test Team Description");
        team.setCreated_at(new Date());
        team.setUpdated_at(new Date());
        
        // Persist and flush
        Teams savedTeam = entityManager.persistAndFlush(team);
        
        // Assert
        assertNotNull(savedTeam.getId(), "Team ID should be auto-generated");
        assertEquals("Test Team", savedTeam.getName());
        assertEquals("Test Location", savedTeam.getLocation());
        assertEquals("Test Team Description", savedTeam.getLogoUrl());
        assertNotNull(savedTeam.getCreated_at(), "Created date should be set");
        assertNotNull(savedTeam.getUpdated_at(), "Updated date should be set");
    }
    
    @Test
    public void testTeamPrePersistHook() {
        // Create a team without setting created_at and updated_at
        Teams team = new Teams();
        team.setName("Auto Date Team");
        team.setLocation("Auto Date Location");
        team.setLogoUrl("Auto Date Description");
        
        // Test that dates are automatically set by @PrePersist
        Teams savedTeam = entityManager.persistAndFlush(team);
        
        // Assert
        assertNotNull(savedTeam.getCreated_at(), "Created date should be automatically set");
        assertNotNull(savedTeam.getUpdated_at(), "Updated date should be automatically set");
    }
    
    @Test
    public void testTeamWithPlayers() {
        // Create a team
        Teams team = new Teams();
        team.setName("Team With Players");
        team.setLocation("Test Location");
        team.setLogoUrl("Test Team Description");
        team.setCreated_at(new Date());
        team.setUpdated_at(new Date());
        
        Teams savedTeam = entityManager.persistAndFlush(team);
        
        // Create players for the team
        Players player1 = new Players();
        player1.setName("Player 1");
        player1.setAge(25);
        player1.setTeam(savedTeam);
        player1.setTeam_id(savedTeam.getId());
        entityManager.persist(player1);
        
        Players player2 = new Players();
        player2.setName("Player 2");
        player2.setAge(28);
        player2.setTeam(savedTeam);
        player2.setTeam_id(savedTeam.getId());
        entityManager.persist(player2);
        
        entityManager.flush();
        
        // Clear entity manager to force a fresh read from the database
        entityManager.clear();
        
        // Retrieve the team again
        Teams retrievedTeam = entityManager.find(Teams.class, savedTeam.getId());
        
        // Assert the players are associated with the team
        assertNotNull(retrievedTeam.getPlayers(), "Players collection should not be null");
        assertEquals(2, retrievedTeam.getPlayers().size(), "Team should have 2 players");
    }
}
