package com.Football.Tournament.controller;

import java.util.List;
import java.util.ArrayList;
import java.util.Collections;
import java.util.stream.Collectors;
import java.util.Date;

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
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.Football.Tournament.entities.Players;
import com.Football.Tournament.entities.Teams;
import com.Football.Tournament.response.ResponseHandler;
import com.Football.Tournament.services.PlayerService;
import com.Football.Tournament.services.TeamService;

import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;

import javax.servlet.http.HttpServletRequest;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/home")
@CrossOrigin(
	originPatterns = {"http://localhost:*", "http://127.0.0.1:*"},
	allowedHeaders = "*",
	allowCredentials = "true",
	maxAge = 3600
)
public class Controller {
	@Autowired
	private TeamService teamService;

	@Autowired
	private PlayerService playerService;

	@ApiOperation(value = "Get list of Teams.")
	@GetMapping("/listTeams")
	@ApiImplicitParams({ 
			@ApiImplicitParam(name = "page_no", dataType = "int", paramType = "query", defaultValue = "0", value = "eg,enter 0 in the textfield,if you want to see first page"),
			@ApiImplicitParam(name = "size", dataType = "int", paramType = "query", defaultValue = "3", value = "Number of records per page") })

	public ResponseEntity<Object> listTeams(@PageableDefault(page = 0, size = 3) @ApiIgnore Pageable pageRequest) {
		try {
			Page<Teams> data = this.teamService.listTeams(pageRequest);
			if (data.isEmpty() == true)
				return ResponseHandler.generateResponse(HttpStatus.OK,
						"No value Present in Teams table or in this page!", data);
			else
				return ResponseHandler.generateResponse(HttpStatus.OK, "successfully retrived!", data);
		} catch (Exception e) {
			return ResponseHandler.generateResponse(HttpStatus.MULTI_STATUS, e.getMessage(), null);
		}
	}

	@ApiOperation(value = "Create a new team.")
	@PostMapping(
		value = "/createTeam",
		consumes = {MediaType.APPLICATION_JSON_VALUE, "application/json;charset=UTF-8", "application/*+json"},
		produces = MediaType.APPLICATION_JSON_VALUE
	)
	@ResponseBody
	public ResponseEntity<Object> createTeam(@RequestBody(required = true) Teams team, HttpServletRequest request) {
		try {
			System.out.println("=== Team Creation Request Details ===");
			System.out.println("Request received at: " + new java.util.Date());
			System.out.println("Content-Type: " + request.getContentType());
			System.out.println("Request Headers: " + Collections.list(request.getHeaderNames())
				.stream()
				.collect(Collectors.toMap(
					headerName -> headerName,
					request::getHeader
				)));
			System.out.println("Team data: " + team);
			System.out.println("===================================");			
			if (team.getName() == null || team.getName().trim().isEmpty()) {
				return ResponseHandler.generateResponse(HttpStatus.BAD_REQUEST, "Team name is required", null);
			}
			if (team.getLocation() == null || team.getLocation().trim().isEmpty()) {
				return ResponseHandler.generateResponse(HttpStatus.BAD_REQUEST, "Team location is required", null);
			}

			if (team.getPlayers() == null) {
				team.setPlayers(new ArrayList<>());
			}

			Teams createdTeam = this.teamService.createTeam(team);
			return ResponseHandler.generateResponse(HttpStatus.OK, "Team created successfully!", createdTeam);
		} catch (Exception e) {
        e.printStackTrace();
        return ResponseHandler.generateResponse(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), null);
		}
	}

	@ApiOperation(value = "Find a team by its team_id.")
	@GetMapping("/findATeam/{id}")
	@ResponseBody
	public ResponseEntity<Object> findATeam(@PathVariable String id) {
		try {
			Teams data = this.teamService.findATeam(Long.parseLong(id));
			return ResponseHandler.generateResponse(HttpStatus.OK, "successfully retrived!", data);
		} catch (Exception e) {
			return ResponseHandler.generateResponse(HttpStatus.MULTI_STATUS, e.getMessage(), null);
		}
	}

	@ApiOperation(value = "Update a Team using team_id.")
	@PutMapping(
		value = "/updateTeam/{id}",
		consumes = {MediaType.APPLICATION_JSON_VALUE, "application/json;charset=UTF-8", "application/*+json"},
		produces = MediaType.APPLICATION_JSON_VALUE
	)
	public ResponseEntity<Object> updateTeam(@PathVariable String id, @RequestBody Teams team) {
		try {
			Teams updatedTeam = this.teamService.updateTeam(Long.parseLong(id), team);
			return ResponseHandler.generateResponse(HttpStatus.OK, "Team updated successfully!", updatedTeam);
		} catch (Exception e) {
			return ResponseHandler.generateResponse(HttpStatus.MULTI_STATUS, e.getMessage(), null);
		}
	}

	// THIS METHOD IS USED FOR DELETING A TEAM USING ITS UNIQUE ID
	@ApiOperation(value = "Delete a Team using its team_id.")
	@DeleteMapping("/deleteTeam/{id}")
	public ResponseEntity<Object> deleteTeam(@PathVariable String id) {
		try {
			this.teamService.deleteTeam(Long.parseLong(id));
			return ResponseHandler.generateResponse(HttpStatus.OK, "successfully deleted!", null);
		} catch (Exception e) {
			return ResponseHandler.generateResponse(HttpStatus.MULTI_STATUS, e.getMessage(), null);
		}

	}

	// USING THE PLAYER ID OF THE PLAYER, THIS METHOD FINDS THE INFORMATION OF
	// PLAYER`S TEAM.
	@ApiOperation(value = "Find the team of a player using player id.")
	@GetMapping("/teamByPlayerId/{id}")
	public ResponseEntity<Object> teamByPlayerId(@PathVariable String id) {
		try {
			Teams data = this.teamService.teamByPlayerId(Long.parseLong(id));
			return ResponseHandler.generateResponse(HttpStatus.OK, "successfully retrived!", data);
		} catch (Exception e) {
			return ResponseHandler.generateResponse(HttpStatus.MULTI_STATUS, e.getMessage(), null);
		}
	}

	// ----------------------------------------------------------------------------------------------------------

	// METHODS FOR "PLAYERS" ENTITY

	// ----------------------------------------------------------------------------------------------------------

	// THIS METHOD RETURNS LIST OF PLAYERS WITH PAGINATION.
	@ApiOperation(value = "Get list of players.")
	@GetMapping("/listPlayers")
	@ApiImplicitParams({ // to correct the swagger request url
			@ApiImplicitParam(name = "page", dataType = "int", paramType = "query", defaultValue = "0", value = "eg,enter 0 in the textfield,if you want to see first page "),
			@ApiImplicitParam(name = "size", dataType = "int", paramType = "query", defaultValue = "3", value = "Number of records per page") })
	public ResponseEntity<Object> listPlayers(@PageableDefault(page = 0, size = 3) @ApiIgnore Pageable pageRequest) {
		try {

			Page<Players> data = this.playerService.listPlayers(pageRequest);
			if (data.isEmpty() == true)
				return ResponseHandler.generateResponse(HttpStatus.OK,
						"No value Present in players table or in this page!", data);
			else
				return ResponseHandler.generateResponse(HttpStatus.OK, "successfully retrived!", data);
		} catch (Exception e) {
			return ResponseHandler.generateResponse(HttpStatus.MULTI_STATUS, e.getMessage(), null);
		}

	}

	// THIS METHOD IS USED FOR CREATING A NEW PLAYER
	@ApiOperation(value = "Create a new player.")
	@PostMapping(
		value = "/createPlayer",
		consumes = {MediaType.APPLICATION_JSON_VALUE, "application/json;charset=UTF-8", "application/*+json"},
		produces = MediaType.APPLICATION_JSON_VALUE
	)
	@ResponseBody
	public ResponseEntity<Object> createPlayer(@RequestBody(required = true) Players player, HttpServletRequest request) {
		try {
			// Enhanced debug logging
			System.out.println("\n=== Player Creation Request Details ===");
			System.out.println("Request received at: " + new java.util.Date());
			System.out.println("Request Method: " + request.getMethod());
			System.out.println("Content-Type: " + request.getContentType());
			System.out.println("Character Encoding: " + request.getCharacterEncoding());
			System.out.println("Request URI: " + request.getRequestURI());
			System.out.println("Request URL: " + request.getRequestURL());
			System.out.println("Request Headers:");
			Collections.list(request.getHeaderNames()).forEach(headerName -> {
				System.out.println("  " + headerName + ": " + request.getHeader(headerName));
			});
			System.out.println("Player data: " + player);
			System.out.println("===================================\n");

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

			// Set timestamps if not set
			if (player.getCreated_at() == null) {
				player.setCreated_at(new Date());
			}
			if (player.getUpdated_at() == null) {
				player.setUpdated_at(new Date());
			}

			Players createdPlayer = this.playerService.createPlayer(player);
			return ResponseHandler.generateResponse(HttpStatus.CREATED, "Player created successfully!", createdPlayer);
		} catch (Exception e) {
			System.err.println("\n=== Error Creating Player ===");
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
			
			return ResponseHandler.generateResponse(HttpStatus.MULTI_STATUS, e.getMessage(), null);
		}
	}

	// YOU CAN FIND A PLAYER WITH THE HELP OF ITS UNIQUE ID.
	@ApiOperation(value = "Find a player by its id.")
	@GetMapping("/findAPlayer/{id}")
	public ResponseEntity<Object> findAPlayer(@PathVariable String id) {
		try {
			Players data = this.playerService.findAPlayer(Long.parseLong(id));
			return ResponseHandler.generateResponse(HttpStatus.OK, "successfully retrived!", data);
		} catch (Exception e) {
			return ResponseHandler.generateResponse(HttpStatus.MULTI_STATUS, e.getMessage(), null);
		}
	}

	// THIS METHOD IS USED FOR UPDATING THE PLAYER INFO. USING ITS UNIQUE ID.
	@ApiOperation(value = "Update player info. using its id.")
	@PutMapping(
		value = "/updatePlayer/{id}",
		consumes = {MediaType.APPLICATION_JSON_VALUE, "application/json;charset=UTF-8", "application/*+json"},
		produces = MediaType.APPLICATION_JSON_VALUE
	)
	public ResponseEntity<Object> updatePlayer(@PathVariable String id, @RequestBody Players player) {
		try {
			this.playerService.updatePlayer(Long.parseLong(id), player);
			return ResponseHandler.generateResponse(HttpStatus.OK, "successfully updated!",null);
		} catch (Exception e) {
			return ResponseHandler.generateResponse(HttpStatus.MULTI_STATUS, e.getMessage(), null);
		}
	}

	// THIS METHOD IS USED FOR DELETING THE PLAYER INFORMATION USING ITS UNIQUE ID.
	@ApiOperation(value = "Delete player info. using its id.")
	@DeleteMapping("/deletePlayer/{id}")
	public ResponseEntity<Object> deletePlayer(@PathVariable String id) {
		try {
			this.playerService.deletePlayer(Long.parseLong(id));
			return ResponseHandler.generateResponse(HttpStatus.OK, "successfully deleted!", null);
		} catch (Exception e) {
			return ResponseHandler.generateResponse(HttpStatus.MULTI_STATUS, e.getMessage(), null);
		}

	}

	// THIS METHOD GIVES US THE LIST OF ALL PLAYERS PLAYING FOR A PERTICULAR TEAM USING TEAM ID.
	@ApiOperation(value = "Find all the players playing in a perticular Team using team id.")
	@GetMapping("/playersByTeamId/{team_id}")
	public ResponseEntity<Object> playersByTeamId(@PathVariable String team_id) {
		try {
			List<Players> data = this.playerService.playersByTeamId(Long.parseLong(team_id));
			if (data.isEmpty() == true)
				return ResponseHandler.generateResponse(HttpStatus.OK, "There are no players in this team!", data);
			else
				return ResponseHandler.generateResponse(HttpStatus.OK, "successfully retrived!", data);
		} catch (Exception e) {
			return ResponseHandler.generateResponse(HttpStatus.MULTI_STATUS, e.getMessage(), null);
		}
	}
	
	// THIS METHOD WILL DELETE ALL THE PLAYERS PLAYING FOR A PERTICULAR TEAM USING TEAM ID.
		@ApiOperation(value = "Delete all the players playing in a perticular Team using team id.")
		@DeleteMapping("/deletePlayersByTeamId/{team_id}")
		public ResponseEntity<Object> deletePlayersByTeamId(@PathVariable String team_id) {
			try {
				this.playerService.deletePlayerByTeamId(Long.parseLong(team_id));
				return ResponseHandler.generateResponse(HttpStatus.OK, "Players who played for this team have been removed!", null);
			
			} catch (Exception e) {
				return ResponseHandler.generateResponse(HttpStatus.MULTI_STATUS, e.getMessage(), null);
			}
		}

}