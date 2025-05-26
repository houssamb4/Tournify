package com.Football.Tournament.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.Football.Tournament.entities.Teams;

//THIS IS THE SERIVCE INTERFACE FOR TEAMS ENTITY.USUALLY MADE FOR LOOSE COUPLING.
//IT IS MADE FOR ACHIEVING ABSTRACTION.
@Service
public interface TeamService {
	
	//UNIMPLEMENTED METHODS

	public Page<Teams> listTeams(Pageable pageRequest);

	public Teams createTeam(Teams team);
	
	public Teams findATeam(long id );
	
	public Teams updateTeam(long id,Teams team);
	
	public void deleteTeam(long id);
	
	public Teams teamByPlayerId(long id);
	
}
