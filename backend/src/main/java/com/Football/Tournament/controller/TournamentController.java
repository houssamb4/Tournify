package com.Football.Tournament.controller;

import java.util.Date;
import java.util.List;
import java.util.Collections;
import java.util.stream.Collectors;
import java.util.HashSet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Football.Tournament.entities.Players;
import com.Football.Tournament.entities.Teams;
import com.Football.Tournament.entities.Tournament;
import com.Football.Tournament.entities.Game;
import com.Football.Tournament.repository.GameRepository;
import com.Football.Tournament.response.ResponseHandler;
import com.Football.Tournament.services.PlayerService;
import com.Football.Tournament.services.TeamService;
import com.Football.Tournament.services.TournamentService;

import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/home")
public class TournamentController {

    @Autowired
    private TournamentService tournamentService;
    
    @Autowired
    private TeamService teamService;
    
    @Autowired
    private PlayerService playerService;
    
    @Autowired
    private GameRepository gameRepository;

    // -------------------------------------------------
    // TOURNAMENT METHODS
    // -------------------------------------------------

    @ApiOperation(value = "Get list of tournaments with pagination")
    @GetMapping("/listTournaments")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "page", dataType = "int", paramType = "query", defaultValue = "0", 
                         value = "Page number (0-based)"),
        @ApiImplicitParam(name = "size", dataType = "int", paramType = "query", defaultValue = "3", 
                         value = "Number of records per page")
    })
    public ResponseEntity<Object> listTournaments(
            @PageableDefault(page = 0, size = 3) @ApiIgnore Pageable pageRequest) {
        try {
            Page<Tournament> data = tournamentService.listTournaments(pageRequest);
            if (data.isEmpty()) {
                return ResponseHandler.generateResponse(HttpStatus.OK, 
                    "No tournaments present or in this page!", data);
            }
            return ResponseHandler.generateResponse(HttpStatus.OK, "Successfully retrieved!", data);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(HttpStatus.MULTI_STATUS, e.getMessage(), null);
        }
    }

    @ApiOperation(value = "Create a new tournament")
    @PostMapping(
        value = "/createTournament",
        consumes = {MediaType.APPLICATION_JSON_VALUE, "application/json;charset=UTF-8", "application/*+json"},
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<Object> createTournament(@RequestBody Tournament tournament, HttpServletRequest request) {
        try {
            // Log request details
            System.out.println("\n=== Tournament Creation Request Details ===");
            System.out.println("Request received at: " + new java.util.Date());
            System.out.println("Content-Type: " + request.getContentType());
            System.out.println("Request Headers: " + Collections.list(request.getHeaderNames())
                .stream()
                .collect(Collectors.toMap(
                    headerName -> headerName,
                    request::getHeader
                )));
            System.out.println("Tournament data: " + tournament);
            System.out.println("===================================\n");

            // Validate required fields
            if (tournament.getName() == null || tournament.getName().trim().isEmpty()) {
                return ResponseHandler.generateResponse(HttpStatus.BAD_REQUEST, "Tournament name is required", null);
            }
            if (tournament.getStartDate() == null) {
                return ResponseHandler.generateResponse(HttpStatus.BAD_REQUEST, "Start date is required", null);
            }
            if (tournament.getEndDate() == null) {
                return ResponseHandler.generateResponse(HttpStatus.BAD_REQUEST, "End date is required", null);
            }
            if (tournament.getEndDate().before(tournament.getStartDate())) {
                return ResponseHandler.generateResponse(HttpStatus.BAD_REQUEST, "End date must be after start date", null);
            }

            // Set timestamps if not set
            if (tournament.getCreated_at() == null) {
                tournament.setCreated_at(new Date());
            }
            if (tournament.getUpdated_at() == null) {
                tournament.setUpdated_at(new Date());
            }

            // Initialize teams set if null
            if (tournament.getTeams() == null) {
                tournament.setTeams(new HashSet<>());
            }
            
            // Handle game relationship if game_id is provided
            if (tournament.getGame() != null && tournament.getGame().getId() != null) {
                Long gameId = tournament.getGame().getId();
                Game game = gameRepository.findById(gameId)
                    .orElseThrow(() -> new RuntimeException("Game not found with id: " + gameId));
                tournament.setGame(game);
            }

            Tournament created = tournamentService.createTournament(tournament);
            return ResponseHandler.generateResponse(HttpStatus.CREATED, "Tournament created successfully!", created);
        } catch (Exception e) {
            System.err.println("\n=== Error Creating Tournament ===");
            System.err.println("Error Type: " + e.getClass().getName());
            System.err.println("Error Message: " + e.getMessage());
            System.err.println("Stack Trace:");
            e.printStackTrace();
            System.err.println("===========================\n");
            
            if (e instanceof com.fasterxml.jackson.databind.exc.MismatchedInputException) {
                return ResponseHandler.generateResponse(
                    HttpStatus.BAD_REQUEST,
                    "Invalid JSON format. Please ensure the request body is a valid JSON object.",
                    null
                );
            }
            
            return ResponseHandler.generateResponse(HttpStatus.BAD_REQUEST, e.getMessage(), null);
        }
    }

    @ApiOperation(value = "Get tournament by ID")
    @GetMapping("/findATournament/{id}")
    public ResponseEntity<Object> findATournament(@PathVariable String id) {
        try {
            Tournament tournament = tournamentService.findATournament(Long.parseLong(id));
            return ResponseHandler.generateResponse(HttpStatus.OK, "Successfully retrieved!", tournament);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(HttpStatus.MULTI_STATUS, e.getMessage(), null);
        }
    }

    @ApiOperation(value = "Update tournament by ID")
    @PutMapping(
        value = "/updateTournament/{id}",
        consumes = {MediaType.APPLICATION_JSON_VALUE, "application/json;charset=UTF-8", "application/*+json"},
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<Object> updateTournament(
            @PathVariable String id, 
            @RequestBody Tournament tournament) {
        try {
            // Handle game relationship if game_id is provided
            if (tournament.getGame() != null && tournament.getGame().getId() != null) {
                Long gameId = tournament.getGame().getId();
                Game game = gameRepository.findById(gameId)
                    .orElseThrow(() -> new RuntimeException("Game not found with id: " + gameId));
                tournament.setGame(game);
            }
            
            Tournament updated = tournamentService.updateTournament(Long.parseLong(id), tournament);
            return ResponseHandler.generateResponse(HttpStatus.OK, "Successfully updated!", updated);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(HttpStatus.MULTI_STATUS, e.getMessage(), null);
        }
    }

    @ApiOperation(value = "Delete tournament by ID")
    @DeleteMapping("/deleteTournament/{id}")
    public ResponseEntity<Object> deleteTournament(@PathVariable String id) {
        try {
            tournamentService.deleteTournament(Long.parseLong(id));
            return ResponseHandler.generateResponse(HttpStatus.NO_CONTENT, "Successfully deleted!", null);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(HttpStatus.MULTI_STATUS, e.getMessage(), null);
        }
    }

    @ApiOperation(value = "Delete all tournaments")
    @DeleteMapping("/deleteAllTournaments")
    public ResponseEntity<Object> deleteAllTournaments() {
        try {
            tournamentService.deleteAllTournaments();
            return ResponseHandler.generateResponse(HttpStatus.OK, "All tournaments deleted successfully!", null);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(HttpStatus.MULTI_STATUS, e.getMessage(), null);
        }
    }

    // -------------------------------------------------
    // TEAM-TOURNAMENT RELATIONSHIP METHODS
    // -------------------------------------------------

    @ApiOperation(value = "Add team to tournament")
    @PostMapping("/addTeamToTournament/{tournamentId}/{teamId}")
    public ResponseEntity<Object> addTeamToTournament(
            @PathVariable String tournamentId, 
            @PathVariable String teamId) {
        try {
            Tournament tournament = tournamentService.addTeamToTournament(
                Long.parseLong(tournamentId), Long.parseLong(teamId));
            return ResponseHandler.generateResponse(HttpStatus.OK, "Team added to tournament!", tournament);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(HttpStatus.MULTI_STATUS, e.getMessage(), null);
        }
    }

    @ApiOperation(value = "Remove team from tournament")
    @DeleteMapping("/removeTeamFromTournament/{tournamentId}/{teamId}")
    public ResponseEntity<Object> removeTeamFromTournament(
            @PathVariable String tournamentId, 
            @PathVariable String teamId) {
        try {
            tournamentService.removeTeamFromTournament(
                Long.parseLong(tournamentId), Long.parseLong(teamId));
            return ResponseHandler.generateResponse(HttpStatus.OK, "Team removed from tournament!", null);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(HttpStatus.MULTI_STATUS, e.getMessage(), null);
        }
    }

    @ApiOperation(value = "Get all teams in tournament")
    @GetMapping("/teamsInTournament/{tournamentId}")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "page", dataType = "int", paramType = "query", defaultValue = "0"),
        @ApiImplicitParam(name = "size", dataType = "int", paramType = "query", defaultValue = "3")
    })
    public ResponseEntity<Object> getTeamsInTournament(
            @PathVariable String tournamentId,
            @PageableDefault(page = 0, size = 3) @ApiIgnore Pageable pageRequest) {
        try {
            Page<Teams> teams = tournamentService.listTeamsInTournament(
                Long.parseLong(tournamentId), pageRequest);
            if (teams.isEmpty()) {
                return ResponseHandler.generateResponse(HttpStatus.OK, 
                    "No teams in this tournament or page!", teams);
            }
            return ResponseHandler.generateResponse(HttpStatus.OK, "Successfully retrieved!", teams);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(HttpStatus.MULTI_STATUS, e.getMessage(), null);
        }
    }

    @ApiOperation(value = "Delete all teams in tournament")
    @DeleteMapping("/deleteAllTeamsInTournament/{tournamentId}")
    public ResponseEntity<Object> deleteAllTeamsInTournament(@PathVariable String tournamentId) {
        try {
            tournamentService.deleteAllTeamsInTournament(Long.parseLong(tournamentId));
            return ResponseHandler.generateResponse(HttpStatus.OK, "All teams removed from tournament!", null);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(HttpStatus.MULTI_STATUS, e.getMessage(), null);
        }
    }

    // -------------------------------------------------
    // PLAYER METHODS FOR TOURNAMENT
    // -------------------------------------------------

    @ApiOperation(value = "Get all players in tournament")
    @GetMapping("/playersInTournament/{tournamentId}")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "page", dataType = "int", paramType = "query", defaultValue = "0"),
        @ApiImplicitParam(name = "size", dataType = "int", paramType = "query", defaultValue = "3")
    })
    public ResponseEntity<Object> getPlayersInTournament(
            @PathVariable String tournamentId,
            @PageableDefault(page = 0, size = 3) @ApiIgnore Pageable pageRequest) {
        try {
            Page<Players> players = playerService.findPlayersByTournamentId(
                Long.parseLong(tournamentId), pageRequest);
            if (players.isEmpty()) {
                return ResponseHandler.generateResponse(HttpStatus.OK, 
                    "No players in this tournament or page!", players);
            }
            return ResponseHandler.generateResponse(HttpStatus.OK, "Successfully retrieved!", players);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(HttpStatus.MULTI_STATUS, e.getMessage(), null);
        }
    }

    @ApiOperation(value = "Delete all players in tournament")
    @DeleteMapping("/deleteAllPlayersInTournament/{tournamentId}")
    public ResponseEntity<Object> deleteAllPlayersInTournament(@PathVariable String tournamentId) {
        try {
            playerService.deleteAllPlayersInTournament(Long.parseLong(tournamentId));
            return ResponseHandler.generateResponse(HttpStatus.OK, "All players removed from tournament!", null);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(HttpStatus.MULTI_STATUS, e.getMessage(), null);
        }
    }

    // -------------------------------------------------
    // SEARCH AND FILTER METHODS
    // -------------------------------------------------

    @ApiOperation(value = "Search tournaments by name")
    @GetMapping("/searchTournaments")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "name", dataType = "string", paramType = "query", required = true),
        @ApiImplicitParam(name = "page", dataType = "int", paramType = "query", defaultValue = "0"),
        @ApiImplicitParam(name = "size", dataType = "int", paramType = "query", defaultValue = "3")
    })
    public ResponseEntity<Object> searchTournaments(
            String name,
            @PageableDefault(page = 0, size = 3) @ApiIgnore Pageable pageRequest) {
        try {
            Page<Tournament> tournaments = tournamentService.findByNameContaining(name, pageRequest);
            if (tournaments.isEmpty()) {
                return ResponseHandler.generateResponse(HttpStatus.OK, 
                    "No tournaments found with that name!", tournaments);
            }
            return ResponseHandler.generateResponse(HttpStatus.OK, "Successfully retrieved!", tournaments);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(HttpStatus.MULTI_STATUS, e.getMessage(), null);
        }
    }

    @ApiOperation(value = "Get active tournaments (current date within start and end dates)")
    @GetMapping("/activeTournaments")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "page", dataType = "int", paramType = "query", defaultValue = "0"),
        @ApiImplicitParam(name = "size", dataType = "int", paramType = "query", defaultValue = "3")
    })
    public ResponseEntity<Object> getActiveTournaments(
            @PageableDefault(page = 0, size = 3) @ApiIgnore Pageable pageRequest) {
        try {
            Page<Tournament> tournaments = tournamentService.findActiveTournaments(new Date(), pageRequest);
            if (tournaments.isEmpty()) {
                return ResponseHandler.generateResponse(HttpStatus.OK, 
                    "No active tournaments currently!", tournaments);
            }
            return ResponseHandler.generateResponse(HttpStatus.OK, "Successfully retrieved!", tournaments);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(HttpStatus.MULTI_STATUS, e.getMessage(), null);
        }
    }
    
}