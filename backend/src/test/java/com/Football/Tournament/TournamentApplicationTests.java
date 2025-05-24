package com.Football.Tournament;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.test.context.ActiveProfiles;

import com.Football.Tournament.dao.PlayerDao;
import com.Football.Tournament.dao.TeamDao;
import com.Football.Tournament.dao.TournamentDao;
import com.Football.Tournament.dao.UserDao;

/**
 * Main application test class to verify the application context loads correctly
 * Uses H2 in-memory database through the test profile
 */
@SpringBootTest
@ActiveProfiles("test")
class TournamentApplicationTests {

	@Autowired
	private ApplicationContext applicationContext;
	
	@Autowired
	private PlayerDao playerDao;
	
	@Autowired
	private TeamDao teamDao;
	
	@Autowired
	private TournamentDao tournamentDao;
	
	@Autowired
	private UserDao userDao;

	/**
	 * Tests that the Spring application context loads successfully
	 */
	@Test
	void contextLoads() {
		assertNotNull(applicationContext, "Application context should not be null");
	}
	
	/**
	 * Tests that all required DAOs are properly injected
	 */
	@Test
	void daoBeansLoad() {
		assertNotNull(playerDao, "PlayerDao should be injected");
		assertNotNull(teamDao, "TeamDao should be injected");
		assertNotNull(tournamentDao, "TournamentDao should be injected");
		assertNotNull(userDao, "UserDao should be injected");
	}
}
