package com.Football.Tournament.services;

import java.math.BigInteger;
import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import com.Football.Tournament.dao.PlayerDao;
import com.Football.Tournament.dao.TeamDao;
import com.Football.Tournament.entities.Players;
import com.Football.Tournament.entities.Teams;

//THIS CLASS IS USED FOR IMPLEMENTING THE METHODS OF PLAYERS SERVICE INTERFACE.

@Component
public class PlayerServiceImpl implements PlayerService {
	
	@PersistenceContext
	private EntityManager entityManager;

	@Autowired
	private PlayerDao playerdao;
	
	@Autowired
	private TeamDao teamdao;
	
	//IMPLEMENTATION OF METHODS

	@Override
	public Page<Players> listPlayers(Pageable pageRequest) {
	return playerdao.findAll(pageRequest);
	}

	@Override
	@Transactional
	public Players createPlayer(Players player) {
		try {
			System.out.println("\n=== Creating Player in Service ===");
			System.out.println("Player data received: " + player);
			System.out.println("Team ID: " + player.getTeam_id());
			
			// Validate team_id and set team reference
			if (player.getTeam_id() <= 0) {
				throw new IllegalArgumentException("Valid team ID is required");
			}
			
			// Check if team exists
			Teams team = teamdao.findById(player.getTeam_id())
				.orElseThrow(() -> {
					System.err.println("Team not found with id: " + player.getTeam_id());
					return new IllegalArgumentException("Team not found with id: " + player.getTeam_id());
				});
			
			System.out.println("Found team: " + team);
			player.setTeam(team);
			
			// Validate required fields
			if (player.getName() == null || player.getName().trim().isEmpty()) {
				throw new IllegalArgumentException("Player name is required");
			}
			
			if (player.getAge() <= 0) {
				throw new IllegalArgumentException("Valid player age is required (must be greater than 0)");
			}
			
			// Set default values if not provided
			if (player.getCreated_at() == null) {
				player.setCreated_at(new Date());
			}
			if (player.getUpdated_at() == null) {
				player.setUpdated_at(new Date());
			}
			
			// Find the maximum ID currently in the database and set the next ID
			Long maxId = 0L;
			try {
				Object result = entityManager.createNativeQuery("SELECT COALESCE(MAX(id), 0) FROM players").getSingleResult();
				// Handle different numeric types that might be returned
				if (result instanceof BigInteger) {
					maxId = ((BigInteger) result).longValue();
				} else if (result instanceof Long) {
					maxId = (Long) result;
				} else if (result instanceof Number) {
					maxId = ((Number) result).longValue();
				} else if (result != null) {
					maxId = Long.parseLong(result.toString());
				}
				System.out.println("Max ID found: " + maxId + " (type: " + (result != null ? result.getClass().getName() : "null") + ")");
			} catch (Exception e) {
				System.err.println("Error finding max ID: " + e.getMessage());
			}

			// Set a new ID value (max + 1)
			Long newId = maxId + 1;
			System.out.println("Using new ID: " + newId);
			
			// Set the new ID on the player object
			player.setId(newId);

			// Use native SQL to insert the player directly, including the ID field
			String sql = "INSERT INTO players (id, name, age, profile_url, team_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)"; 
			
			int rowsAffected = entityManager.createNativeQuery(sql)
				.setParameter(1, newId)
				.setParameter(2, player.getName())
				.setParameter(3, player.getAge())
				.setParameter(4, player.getProfileUrl())
				.setParameter(5, player.getTeam_id())
				.setParameter(6, player.getCreated_at())
				.setParameter(7, player.getUpdated_at())
				.executeUpdate();
			
			System.out.println("Rows affected by direct SQL insert: " + rowsAffected);
			
			System.out.println("Player created successfully with ID: " + player.getId());
			System.out.println("===================================\n");
			
			// Return the player with the ID that was used
			System.out.println("Returning player with ID: " + player.getId());
			return player;
		} catch (IllegalArgumentException e) {
			System.err.println("\n=== Validation Error in PlayerService.createPlayer ===");
			System.err.println("Error Message: " + e.getMessage());
			System.err.println("===================================\n");
			throw e;
		} catch (Exception e) {
			System.err.println("\n=== Error in PlayerService.createPlayer ===");
			System.err.println("Error Type: " + e.getClass().getName());
			System.err.println("Error Message: " + e.getMessage());
			System.err.println("Stack Trace:");
			e.printStackTrace();
			System.err.println("===================================\n");
			
			// More specific error handling
			if (e.getMessage() != null && e.getMessage().contains("constraint")) {
				throw new RuntimeException("Database constraint violation. Please check that the team exists and all required fields are valid.", e);
			}
			
			throw e;
		}
	}

	@Override
	public Players findAPlayer(long id) {
		return playerdao.findById(id)
			.orElseThrow(() -> new RuntimeException("Player not found with id: " + id));
	}

	@Override
	public Players updatePlayer(long id, Players player) {
		Players existingPlayer = findAPlayer(id);
		existingPlayer.setName(player.getName());
		existingPlayer.setAge(player.getAge());
		if (player.getTeam_id() > 0) {
			Teams team = teamdao.findById(player.getTeam_id())
				.orElseThrow(() -> new RuntimeException("Team not found with id: " + player.getTeam_id()));
			existingPlayer.setTeam(team);
		}
		return playerdao.save(existingPlayer);
	}

	@Override
	public void deletePlayer(long id) {
		Players player = findAPlayer(id);
		playerdao.delete(player);
	}

	@Override
	public List<Players> playersByTeamId(long team_id) {
		
	return playerdao.findByTeamId(team_id);
		
		
	}

	@Override
	public void deletePlayerByTeamId(long team_id) {
		List<Players> players = playerdao.findByTeamId(team_id);
		playerdao.deleteAll(players);
	}

	@Override
	public Page<Players> findPlayersByTournamentId(long tournamentId, Pageable pageRequest) {
		return playerdao.findByTournamentId(tournamentId, pageRequest);
	}

	@Override
	public void deleteAllPlayersInTournament(long tournamentId) {
		List<Players> players = playerdao.findByTournamentId(tournamentId);
		playerdao.deleteAll(players);
	}

}
