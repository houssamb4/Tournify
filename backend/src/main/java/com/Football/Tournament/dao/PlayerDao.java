package com.Football.Tournament.dao;

//THIS IS A DAO INTERFACE EXTENDING JPA REPOSITORY FOR PLAYER ENTITY TO PERFORM CRUD OPERATIONS. 

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.Football.Tournament.entities.Players;

@Repository
public interface PlayerDao extends JpaRepository<Players, Long> {

// USING @QUERY ANNOTATION IN SPRING DATA JPA TO EXECUTE JPQL QUERIES.
	//THIS WILL SELECT PLAYERS WHICH BELONG TO PERTICULAR TEAM_ID.
	
@Query("SELECT p FROM Players p WHERE p.team.id = :team_id")	
List<Players> findByTeamId(@Param("team_id") long team_id);

@Query("SELECT p FROM Players p WHERE p.team.id IN (SELECT t.id FROM Teams t JOIN t.tournaments tour WHERE tour.id = :tournamentId)")
Page<Players> findByTournamentId(@Param("tournamentId") long tournamentId, Pageable pageable);

@Query("SELECT p FROM Players p WHERE p.team.id IN (SELECT t.id FROM Teams t JOIN t.tournaments tour WHERE tour.id = :tournamentId)")
List<Players> findByTournamentId(@Param("tournamentId") long tournamentId);

// Delete all players associated with a team
@Query("DELETE FROM Players p WHERE p.team.id = :teamId")
void deleteByTeam_id(@Param("teamId") long teamId);

// Find the maximum ID in the players table
@Query("SELECT MAX(p.id) FROM Players p")
Long findMaxId();

// Find players by game ID through the relationship chain: Game -> Tournament -> Teams -> Players
@Query("SELECT DISTINCT p FROM Players p JOIN p.team t JOIN t.tournaments tour WHERE tour.game.id = :gameId")
List<Players> findByGameId(@Param("gameId") Long gameId);

// Find players by game ID with pagination
@Query("SELECT DISTINCT p FROM Players p JOIN p.team t JOIN t.tournaments tour WHERE tour.game.id = :gameId")
Page<Players> findByGameId(@Param("gameId") Long gameId, Pageable pageable);
}
