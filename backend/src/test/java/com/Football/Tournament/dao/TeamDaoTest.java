package com.Football.Tournament.dao;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;

import com.Football.Tournament.entities.Teams;

/**
 * Test class for TeamDao
 * Tests basic CRUD operations for Teams
 */
@DataJpaTest
@ActiveProfiles("test")
public class TeamDaoTest {

    @Autowired
    private TeamDao teamDao;
    
    @Test
    public void testSaveTeam() {
        // Create a team
        Teams team = new Teams();
        team.setName("Test Team Save");
        team.setLocation("Test Location");
        team.setLogoUrl("Test Team Description");
        
        // Save the team
        Teams savedTeam = teamDao.save(team);
        
        // Verify ID was auto-generated
        assertNotNull(savedTeam.getId(), "Team ID should be auto-generated");
        assertTrue(savedTeam.getId() > 0, "Team ID should be greater than 0");
        
        // Verify other fields
        assertEquals("Test Team Save", savedTeam.getName());
        assertEquals("Test Location", savedTeam.getLocation());
        assertEquals("Test Team Description", savedTeam.getLogoUrl());
    }
    
    @Test
    public void testFindTeamById() {
        // Create a team
        Teams team = new Teams();
        team.setName("Find Team");
        team.setLocation("Find Location");
        team.setLogoUrl("Find Team Description");
        
        // Save the team
        Teams savedTeam = teamDao.save(team);
        
        // Find the team by ID
        Optional<Teams> foundTeam = teamDao.findById(savedTeam.getId());
        
        // Verify
        assertTrue(foundTeam.isPresent(), "Team should be found");
        assertEquals(savedTeam.getId(), foundTeam.get().getId());
        assertEquals("Find Team", foundTeam.get().getName());
    }
    
    @Test
    public void testFindAllTeams() {
        // Create several teams
        Teams team1 = new Teams();
        team1.setName("Team 1");
        team1.setLocation("Location 1");
        team1.setLogoUrl("Logo 1");
        teamDao.save(team1);
        
        Teams team2 = new Teams();
        team2.setName("Team 2");
        team2.setLocation("Location 2");
        team2.setLogoUrl("Logo 2");
        teamDao.save(team2);
        
        // Find all teams with pagination
        Page<Teams> teamsPage = teamDao.findAll(PageRequest.of(0, 10));
        
        // Verify
        assertNotNull(teamsPage, "Page of teams should not be null");
        assertTrue(teamsPage.getTotalElements() >= 2, "Should find at least 2 teams");
    }
    
    @Test
    public void testDeleteTeam() {
        // Create a team
        Teams team = new Teams();
        team.setName("Delete Team");
        team.setLocation("Delete Location");
        team.setLogoUrl("Delete Team Description");
        
        // Save the team
        Teams savedTeam = teamDao.save(team);
        
        // Delete the team
        teamDao.delete(savedTeam);
        
        // Try to find the deleted team
        Optional<Teams> foundTeam = teamDao.findById(savedTeam.getId());
        
        // Verify
        assertFalse(foundTeam.isPresent(), "Team should not be found after deletion");
    }
}
