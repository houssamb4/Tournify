package com.Football.Tournament.controller;

import java.util.List;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.Football.Tournament.entities.Players;
import com.Football.Tournament.response.ResponseHandler;
import com.Football.Tournament.services.PlayerService;

import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;

@RestController
@RequestMapping("/api/players")
@CrossOrigin(
    originPatterns = {"http://localhost:8081", "http://127.0.0.1:8081"},
    allowedHeaders = "*",
    allowCredentials = "true",
    maxAge = 3600
)
public class PlayerController {

    @Autowired
    private PlayerService playerService;

    @ApiOperation(value = "Create a new player")
    @PostMapping(
        value = "/create",
        consumes = {
            MediaType.APPLICATION_JSON_VALUE,
            "application/json;charset=UTF-8",
            "application/json",
            "application/*+json"
        },
        produces = {
            MediaType.APPLICATION_JSON_VALUE,
            "application/json;charset=UTF-8",
            "application/json",
            "application/*+json"
        }
    )
    public ResponseEntity<Object> createPlayer(@RequestBody Players player) {
        try {
            // Validate required fields
            if (player.getName() == null || player.getName().trim().isEmpty()) {
                return ResponseHandler.generateResponse(HttpStatus.BAD_REQUEST, "Player name is required", null);
            }
            if (player.getAge() <= 0) {
                return ResponseHandler.generateResponse(HttpStatus.BAD_REQUEST, "Valid player age is required (must be greater than 0)", null);
            }
            if (player.getTeam_id() <= 0) {
                return ResponseHandler.generateResponse(HttpStatus.BAD_REQUEST, "Valid team ID is required", null);
            }

            // Set timestamps
            player.setCreated_at(new Date());
            player.setUpdated_at(new Date());

            Players createdPlayer = playerService.createPlayer(player);
            return ResponseHandler.generateResponse(HttpStatus.CREATED, "Player created successfully!", createdPlayer);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(HttpStatus.BAD_REQUEST, e.getMessage(), null);
        }
    }

    @ApiOperation(value = "Get list of players with pagination")
    @GetMapping(
        value = "/list",
        produces = {
            MediaType.APPLICATION_JSON_VALUE,
            "application/json;charset=UTF-8",
            "application/json",
            "application/*+json"
        }
    )
    @ApiImplicitParams({
        @ApiImplicitParam(name = "page", dataType = "int", paramType = "query", defaultValue = "0"),
        @ApiImplicitParam(name = "size", dataType = "int", paramType = "query", defaultValue = "10")
    })
    public ResponseEntity<Object> listPlayers(
            @PageableDefault(page = 0, size = 10) @ApiIgnore Pageable pageRequest) {
        try {
            Page<Players> players = playerService.listPlayers(pageRequest);
            if (players.isEmpty()) {
                return ResponseHandler.generateResponse(HttpStatus.OK, "No players found!", players);
            }
            return ResponseHandler.generateResponse(HttpStatus.OK, "Successfully retrieved!", players);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(HttpStatus.BAD_REQUEST, e.getMessage(), null);
        }
    }

    @ApiOperation(value = "Get player by ID")
    @GetMapping(
        value = "/{id}",
        produces = {
            MediaType.APPLICATION_JSON_VALUE,
            "application/json;charset=UTF-8",
            "application/json",
            "application/*+json"
        }
    )
    public ResponseEntity<Object> getPlayer(@PathVariable Long id) {
        try {
            Players player = playerService.findAPlayer(id);
            return ResponseHandler.generateResponse(HttpStatus.OK, "Successfully retrieved!", player);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(HttpStatus.BAD_REQUEST, e.getMessage(), null);
        }
    }

    @ApiOperation(value = "Update player")
    @PutMapping(
        value = "/{id}",
        consumes = {
            MediaType.APPLICATION_JSON_VALUE,
            "application/json;charset=UTF-8",
            "application/json",
            "application/*+json"
        },
        produces = {
            MediaType.APPLICATION_JSON_VALUE,
            "application/json;charset=UTF-8",
            "application/json",
            "application/*+json"
        }
    )
    public ResponseEntity<Object> updatePlayer(@PathVariable Long id, @RequestBody Players player) {
        try {
            Players updatedPlayer = playerService.updatePlayer(id, player);
            return ResponseHandler.generateResponse(HttpStatus.OK, "Player updated successfully!", updatedPlayer);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(HttpStatus.BAD_REQUEST, e.getMessage(), null);
        }
    }

    @ApiOperation(value = "Delete player")
    @DeleteMapping(
        value = "/{id}",
        produces = {
            MediaType.APPLICATION_JSON_VALUE,
            "application/json;charset=UTF-8",
            "application/json",
            "application/*+json"
        }
    )
    public ResponseEntity<Object> deletePlayer(@PathVariable Long id) {
        try {
            playerService.deletePlayer(id);
            return ResponseHandler.generateResponse(HttpStatus.OK, "Player deleted successfully!", null);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(HttpStatus.BAD_REQUEST, e.getMessage(), null);
        }
    }

    @ApiOperation(value = "Get players by team ID")
    @GetMapping(
        value = "/team/{teamId}",
        produces = {
            MediaType.APPLICATION_JSON_VALUE,
            "application/json;charset=UTF-8",
            "application/json",
            "application/*+json"
        }
    )
    public ResponseEntity<Object> getPlayersByTeam(@PathVariable Long teamId) {
        try {
            List<Players> players = playerService.playersByTeamId(teamId);
            if (players.isEmpty()) {
                return ResponseHandler.generateResponse(HttpStatus.OK, "No players found for this team!", players);
            }
            return ResponseHandler.generateResponse(HttpStatus.OK, "Successfully retrieved!", players);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(HttpStatus.BAD_REQUEST, e.getMessage(), null);
        }
    }
} 