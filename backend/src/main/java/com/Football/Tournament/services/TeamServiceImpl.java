package com.Football.Tournament.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import com.Football.Tournament.dao.PlayerDao;
import com.Football.Tournament.dao.TeamDao;
import com.Football.Tournament.entities.Players;
import com.Football.Tournament.entities.Teams;

//THIS CLASS IS USED FOR IMPLEMENTING THE METHODS OF TEAMS SERVICE INTERFACE.
@Component
public class TeamServiceImpl implements TeamService {
	
	@Autowired
	private TeamDao teamdao;
	
	@Autowired
	private PlayerDao playerdao;
	
	//IMPLEMENTATION OF METHODS

	@Override
	public Page<Teams> listTeams(Pageable pageRequest) {
	return teamdao.findAll(pageRequest);
	}

	@Override
	public Teams createTeam(Teams team) {
		try {
			System.out.println("=== Creating Team ===");
			System.out.println("Team data before save: " + team);
			Teams savedTeam = teamdao.save(team);
			System.out.println("Team saved successfully with ID: " + savedTeam.getId());
			return savedTeam;
		} catch (Exception e) {
			System.err.println("Error creating team: " + e.getMessage());
			e.printStackTrace();
			throw e;
		}
	}

	@Override
	public Teams findATeam(long id) {
	return teamdao.findById(id).get();
	}

	@Override
	public Teams updateTeam(long id,Teams team) {
		Teams ent=teamdao.findById(id).get();
		ent.setName(team.getName());
		ent.setLocation(team.getLocation());
		ent.setLogoUrl(team.getLogoUrl());
		return teamdao.save(ent);
	}

	@Override
	public void deleteTeam(long id) {
		try {
			Teams ent = teamdao.findById(id).orElseThrow(() -> 
				new RuntimeException("Team not found with id: " + id));
			
			// First, delete all players associated with this team
			System.out.println("Deleting all players for team with ID: " + id);
			playerdao.deleteByTeam_id(id);
			
			// Then delete the team
			System.out.println("Deleting team with ID: " + id);
			teamdao.delete(ent);
		} catch (Exception e) {
			System.err.println("Error deleting team: " + e.getMessage());
			e.printStackTrace();
			throw new RuntimeException("Could not delete team: " + e.getMessage(), e);
		}
	}

	@Override
	public Teams teamByPlayerId(long id) {
		Players ent=playerdao.findById(id).get();
		return teamdao.findById(ent.getTeam_id()).get();
		
		
	}

	

}
