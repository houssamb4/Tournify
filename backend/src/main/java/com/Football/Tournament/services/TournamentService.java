package com.Football.Tournament.services;

import java.util.Date;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.Football.Tournament.entities.Teams;
import com.Football.Tournament.entities.Tournament;

@Service
public interface TournamentService {
    
    public Page<Tournament> listTournaments(Pageable pageRequest);
    public Tournament createTournament(Tournament tournament);
    public Tournament findATournament(long id);
    public Tournament updateTournament(long id, Tournament tournament);
    public void deleteTournament(long id);
    
    public Tournament addTeamToTournament(long tournamentId, long teamId);
    public void removeTeamFromTournament(long tournamentId, long teamId);
    public Page<Teams> listTeamsInTournament(long tournamentId, Pageable pageRequest);
    
    public Page<Tournament> findByNameContaining(String name, Pageable pageRequest);
    public Page<Tournament> findActiveTournaments(Date currentDate, Pageable pageRequest);
    
    public void deleteAllTournaments();
    public void deleteAllTeamsInTournament(long tournamentId);
}