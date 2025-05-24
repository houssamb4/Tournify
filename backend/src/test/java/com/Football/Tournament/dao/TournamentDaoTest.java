package com.Football.Tournament.dao;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Date;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;

import com.Football.Tournament.entities.Tournament;

/**
 * Test class for TournamentDao
 * Tests basic CRUD operations and search functionality for Tournaments
 */
@DataJpaTest
@ActiveProfiles("test")
public class TournamentDaoTest {

    @Autowired
    private TournamentDao tournamentDao;
    
    @Test
    public void testSaveTournament() {
        // Create a tournament
        Tournament tournament = new Tournament();
        tournament.setName("Test Tournament Save");
        tournament.setLogoUrl("Test Tournament Description");
        tournament.setLogoUrl("Test Location");
        tournament.setStartDate(new Date());
        tournament.setEndDate(new Date(System.currentTimeMillis() + 86400000)); // One day later
        
        // Save the tournament
        Tournament savedTournament = tournamentDao.save(tournament);
        
        // Verify ID was auto-generated
        assertNotNull(savedTournament.getId(), "Tournament ID should be auto-generated");
        assertTrue(savedTournament.getId() > 0, "Tournament ID should be greater than 0");
        
        // Verify other fields
        assertEquals("Test Tournament Save", savedTournament.getName());
        assertEquals("Test Location", savedTournament.getLogoUrl());
        assertNotNull(savedTournament.getStartDate(), "Start date should be set");
        assertNotNull(savedTournament.getEndDate(), "End date should be set");
    }
    
    @Test
    public void testFindTournamentById() {
        // Create a tournament
        Tournament tournament = new Tournament();
        tournament.setName("Find Tournament");
        tournament.setLogoUrl("Find Tournament Description");
        tournament.setLogoUrl("Find Location");
        tournament.setStartDate(new Date());
        tournament.setEndDate(new Date(System.currentTimeMillis() + 86400000)); // One day later
        
        // Save the tournament
        Tournament savedTournament = tournamentDao.save(tournament);
        
        // Find the tournament by ID
        Optional<Tournament> foundTournament = tournamentDao.findById(savedTournament.getId());
        
        // Verify
        assertTrue(foundTournament.isPresent(), "Tournament should be found");
        assertEquals(savedTournament.getId(), foundTournament.get().getId());
        assertEquals("Find Tournament", foundTournament.get().getName());
    }
    
    @Test
    public void testFindAllTournaments() {
        // Create several tournaments
        Tournament tournament1 = new Tournament();
        tournament1.setName("Tournament 1");
        tournament1.setLogoUrl("Logo 1");
        tournament1.setStartDate(new Date());
        tournament1.setEndDate(new Date(System.currentTimeMillis() + 86400000)); // One day later
        tournamentDao.save(tournament1);
        
        Tournament tournament2 = new Tournament();
        tournament2.setName("Tournament 2");
        tournament2.setLogoUrl("Logo 2");
        tournament2.setStartDate(new Date());
        tournament2.setEndDate(new Date(System.currentTimeMillis() + 86400000)); // One day later
        tournamentDao.save(tournament2);
        
        // Find all tournaments with pagination
        Page<Tournament> tournamentsPage = tournamentDao.findAll(PageRequest.of(0, 10));
        
        // Verify
        assertNotNull(tournamentsPage, "Page of tournaments should not be null");
        assertTrue(tournamentsPage.getTotalElements() >= 2, "Should find at least 2 tournaments");
    }
    
    @Test
    public void testSearchTournamentByName() {
        // Create tournaments with specific names
        Tournament tournament1 = new Tournament();
        tournament1.setName("World Cup 2026");
        tournament1.setLogoUrl("https://example.com/worldcup2026.png");
        tournament1.setStartDate(new Date());
        tournament1.setEndDate(new Date(System.currentTimeMillis() + 86400000)); // One day later
        tournamentDao.save(tournament1);
        
        Tournament tournament2 = new Tournament();
        tournament2.setName("Euro Cup 2024");
        tournament2.setLogoUrl("https://example.com/eurocup2024.png");
        tournament2.setStartDate(new Date());
        tournament2.setEndDate(new Date(System.currentTimeMillis() + 86400000)); // One day later
        tournamentDao.save(tournament2);
        
        // Search for tournaments with "World" in the name
        Page<Tournament> worldTournaments = tournamentDao.findByNameContaining("World", PageRequest.of(0, 10));
        
        // Verify
        assertNotNull(worldTournaments, "Page of tournaments should not be null");
        assertEquals(1, worldTournaments.getTotalElements(), "Should find 1 tournament with 'World' in name");
        assertEquals("World Cup 2026", worldTournaments.getContent().get(0).getName());
    }
    
    @Test
    public void testActiveTournaments() {
        // Create an active tournament (current date between start and end)
        Date now = new Date();
        Date pastDate = new Date(now.getTime() - 86400000); // One day ago
        Date futureDate = new Date(now.getTime() + 86400000); // One day in future
        
        Tournament activeTournament = new Tournament();
        activeTournament.setName("Active Tournament");
        activeTournament.setLogoUrl("https://example.com/active.png");
        activeTournament.setStartDate(pastDate);
        activeTournament.setEndDate(futureDate);
        tournamentDao.save(activeTournament);
        
        // Create a future tournament
        Date futureDateStart = new Date(now.getTime() + 10 * 86400000); // Ten days in future
        Date futureDateEnd = new Date(now.getTime() + 20 * 86400000); // Twenty days in future
        
        Tournament futureTournament = new Tournament();
        futureTournament.setName("Future Tournament");
        futureTournament.setLogoUrl("https://example.com/future.png");
        futureTournament.setStartDate(futureDateStart);
        futureTournament.setEndDate(futureDateEnd);
        tournamentDao.save(futureTournament);
        
        // Search for active tournaments
        Page<Tournament> activeTournaments = tournamentDao.findByStartDateLessThanEqualAndEndDateGreaterThanEqual(
            now, now, PageRequest.of(0, 10));
        
        // Verify
        assertNotNull(activeTournaments, "Page of active tournaments should not be null");
        assertEquals(1, activeTournaments.getTotalElements(), "Should find 1 active tournament");
        assertEquals("Active Tournament", activeTournaments.getContent().get(0).getName());
    }
    
    @Test
    public void testDeleteTournament() {
        // Create a tournament
        Tournament tournament = new Tournament();
        tournament.setName("Delete Tournament");
        tournament.setLogoUrl("Delete Tournament Description");
        tournament.setLogoUrl("Delete Location");
        tournament.setStartDate(new Date());
        tournament.setEndDate(new Date(System.currentTimeMillis() + 86400000)); // One day later
        
        // Save the tournament
        Tournament savedTournament = tournamentDao.save(tournament);
        
        // Delete the tournament
        tournamentDao.delete(savedTournament);
        
        // Try to find the deleted tournament
        Optional<Tournament> foundTournament = tournamentDao.findById(savedTournament.getId());
        
        // Verify
        assertFalse(foundTournament.isPresent(), "Tournament should not be found after deletion");
    }
}
