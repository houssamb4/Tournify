package com.Football.Tournament.services;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.Football.Tournament.entities.Players;

//THIS IS THE SERIVCE INTERFACE FOR PLAYERS ENTITY.USUALLY MADE FOR LOOSE COUPLING.
//IT IS MADE FOR ACHIEVING ABSTRACTION.
@Service
public interface PlayerService {
	
	
	public Page<Players> listPlayers(Pageable pageRequest);

	public Players createPlayer(Players player);
	
	public Players findAPlayer(long id );
	
	public Players updatePlayer(long id,Players player);
	
	public void deletePlayer(long id);
	
	public void deletePlayerByTeamId(long team_id);
	
	public List<Players> playersByTeamId(long team_id);
	
	public Page<Players> findPlayersByTournamentId(long tournamentId, Pageable pageRequest);
	
	public void deleteAllPlayersInTournament(long tournamentId);

}
