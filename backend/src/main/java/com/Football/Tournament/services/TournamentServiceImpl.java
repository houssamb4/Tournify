package com.Football.Tournament.services;

import java.util.Date;
import java.util.HashSet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import com.Football.Tournament.dao.TeamDao;
import com.Football.Tournament.dao.TournamentDao;
import com.Football.Tournament.entities.Teams;
import com.Football.Tournament.entities.Tournament;

@Component
public class TournamentServiceImpl implements TournamentService {

    @Autowired
    private TournamentDao tournamentDao;
    
    @Autowired
    private TeamDao teamDao;

    @Override
    public Page<Tournament> listTournaments(Pageable pageRequest) {
        return tournamentDao.findAll(pageRequest);
    }

    @Override
    public Tournament createTournament(Tournament tournament) {
        try {
            // Additional validation
            if (tournament.getName() != null) {
                // Check if tournament with same name exists
                if (tournamentDao.findByNameContaining(tournament.getName(), Pageable.unpaged()).hasContent()) {
                    throw new RuntimeException("A tournament with this name already exists");
                }
            }

            // Ensure dates are valid
            if (tournament.getStartDate() != null && tournament.getEndDate() != null) {
                if (tournament.getEndDate().before(tournament.getStartDate())) {
                    throw new RuntimeException("End date must be after start date");
                }
            }

            // Set default values if not provided
            if (tournament.getCreated_at() == null) {
                tournament.setCreated_at(new Date());
            }
            if (tournament.getUpdated_at() == null) {
                tournament.setUpdated_at(new Date());
            }
            if (tournament.getTeams() == null) {
                tournament.setTeams(new HashSet<>());
            }

            return tournamentDao.save(tournament);
        } catch (Exception e) {
            throw new RuntimeException("Error creating tournament: " + e.getMessage(), e);
        }
    }

    @Override
    public Tournament findATournament(long id) {
        return tournamentDao.findById(id).orElseThrow(
            () -> new RuntimeException("Tournament not found with id: " + id)
        );
    }

    @Override
    public Tournament updateTournament(long id, Tournament tournament) {
        Tournament existingTournament = findATournament(id);
        existingTournament.setName(tournament.getName());
        existingTournament.setLogoUrl(tournament.getLogoUrl());
        existingTournament.setStartDate(tournament.getStartDate());
        existingTournament.setEndDate(tournament.getEndDate());
        return tournamentDao.save(existingTournament);
    }

    @Override
    public void deleteTournament(long id) {
        try {
            Tournament tournament = findATournament(id);
            
            // First, remove all team associations
            System.out.println("Removing all team associations for tournament with ID: " + id);
            tournament.getTeams().clear();
            tournamentDao.save(tournament);
            
            // Then delete the tournament
            System.out.println("Deleting tournament with ID: " + id);
            tournamentDao.delete(tournament);
        } catch (Exception e) {
            System.err.println("Error deleting tournament: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Could not delete tournament: " + e.getMessage(), e);
        }
    }

    @Override
    public Tournament addTeamToTournament(long tournamentId, long teamId) {
        Tournament tournament = findATournament(tournamentId);
        Teams team = teamDao.findById(teamId).orElseThrow(
            () -> new RuntimeException("Team not found with id: " + teamId)
        );
        tournament.getTeams().add(team);
        return tournamentDao.save(tournament);
    }

    @Override
    public void removeTeamFromTournament(long tournamentId, long teamId) {
        Tournament tournament = findATournament(tournamentId);
        Teams team = teamDao.findById(teamId).orElseThrow(
            () -> new RuntimeException("Team not found with id: " + teamId)
        );
        tournament.getTeams().remove(team);
        tournamentDao.save(tournament);
    }

    @Override
    public Page<Teams> listTeamsInTournament(long tournamentId, Pageable pageRequest) {
        return teamDao.findByTournamentsId(tournamentId, pageRequest);
    }

    @Override
    public Page<Tournament> findByNameContaining(String name, Pageable pageRequest) {
        return tournamentDao.findByNameContaining(name, pageRequest);
    }

    @Override
    public Page<Tournament> findActiveTournaments(Date currentDate, Pageable pageRequest) {
        return tournamentDao.findByStartDateLessThanEqualAndEndDateGreaterThanEqual(
            currentDate, currentDate, pageRequest);
    }

    @Override
    public void deleteAllTournaments() {
        tournamentDao.deleteAll();
    }

    @Override
    public void deleteAllTeamsInTournament(long tournamentId) {
        Tournament tournament = findATournament(tournamentId);
        tournament.getTeams().clear();
        tournamentDao.save(tournament);
    }
}