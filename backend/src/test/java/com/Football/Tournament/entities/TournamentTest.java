package com.Football.Tournament.entities;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Date;
import java.util.HashSet;
import javax.persistence.EntityManager;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

/**
 * Test class for Tournament entity
 */
@DataJpaTest
@ActiveProfiles("test")
public class TournamentTest {

    @Autowired
    private TestEntityManager entityManager;

    @Test
    public void testCreateTournament() {
        // Create a tournament
        Tournament tournament = new Tournament();
        tournament.setName("Test Tournament");
        tournament.setLogoUrl("https://example.com/logo.png");
        tournament.setStartDate(new Date());
        tournament.setEndDate(new Date(System.currentTimeMillis() + 86400000)); // One day later
        tournament.setCreated_at(new Date());
        tournament.setUpdated_at(new Date());
        
        // Persist and flush
        Tournament savedTournament = entityManager.persistAndFlush(tournament);
        
        // Assert
        assertNotNull(savedTournament.getId(), "Tournament ID should be auto-generated");
        assertEquals("Test Tournament", savedTournament.getName());
        assertEquals("https://example.com/logo.png", savedTournament.getLogoUrl());
        assertNotNull(savedTournament.getStartDate(), "Start date should be set");
        assertNotNull(savedTournament.getEndDate(), "End date should be set");
        assertNotNull(savedTournament.getCreated_at(), "Created date should be set");
        assertNotNull(savedTournament.getUpdated_at(), "Updated date should be set");
    }
    
    @Test
    public void testTournamentPrePersistHook() {
        // Create a tournament without setting created_at and updated_at
        Tournament tournament = new Tournament();
        tournament.setName("Auto Date Tournament");
        tournament.setLogoUrl("https://example.com/logo.png");
        tournament.setStartDate(new Date());
        tournament.setEndDate(new Date(System.currentTimeMillis() + 86400000)); // One day later
        
        // Test that dates are automatically set by @PrePersist
        Tournament savedTournament = entityManager.persistAndFlush(tournament);
        
        // Assert
        assertNotNull(savedTournament.getCreated_at(), "Created date should be automatically set");
        assertNotNull(savedTournament.getUpdated_at(), "Updated date should be automatically set");
    }
    
    @Test
    @Transactional
    public void testTournamentWithTeams() {
        // Clear the database to ensure a clean test
        // First get the EntityManager from TestEntityManager
        EntityManager em = entityManager.getEntityManager();
        
        // Execute delete statements in the correct order to respect foreign key constraints
        em.createNativeQuery("DELETE FROM tournament_teams").executeUpdate();
        em.createNativeQuery("DELETE FROM players").executeUpdate(); // First delete players, as they reference teams
        em.createNativeQuery("DELETE FROM teams").executeUpdate(); // Then delete teams
        em.createNativeQuery("DELETE FROM tournaments").executeUpdate(); // Finally delete tournaments
        em.flush();
        // Create a tournament
        Tournament tournament = new Tournament();
        tournament.setName("Tournament With Teams");
        tournament.setLogoUrl("https://example.com/logo.png");
        tournament.setStartDate(new Date());
        tournament.setEndDate(new Date(System.currentTimeMillis() + 86400000)); // One day later
        
        Tournament savedTournament = entityManager.persistAndFlush(tournament);
        
        // Create teams for the tournament
        Teams team1 = new Teams();
        team1.setName("Team 1");
        team1.setLocation("Team 1 Location");
        team1.setLogoUrl("https://example.com/team1.png");
        entityManager.persist(team1);
        
        Teams team2 = new Teams();
        team2.setName("Team 2");
        team2.setLocation("Team 2 Location");
        team2.setLogoUrl("https://example.com/team2.png");
        entityManager.persist(team2);
        
        // Initialize teams collection if null
        if (savedTournament.getTeams() == null) {
            savedTournament.setTeams(new HashSet<>());
        }
        
        // Add teams to tournament
        savedTournament.getTeams().add(team1);
        savedTournament.getTeams().add(team2);
        
        // Save the tournament with the teams
        savedTournament = entityManager.merge(savedTournament);
        entityManager.flush();
        
        // Clear entity manager to force a fresh read from the database
        entityManager.clear();
        
        // Retrieve the tournament again
        Tournament retrievedTournament = entityManager.find(Tournament.class, savedTournament.getId());
        
        // Assert the teams are associated with the tournament
        assertNotNull(retrievedTournament.getTeams(), "Teams collection should not be null");
        assertEquals(2, retrievedTournament.getTeams().size(), "Tournament should have 2 teams");
    }
}
