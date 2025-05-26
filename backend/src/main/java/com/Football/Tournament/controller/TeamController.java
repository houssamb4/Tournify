package com.Football.Tournament.controller;

import com.Football.Tournament.entities.Teams;
import com.Football.Tournament.services.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    @Autowired
    private TeamService teamService;

    @PostMapping
    public ResponseEntity<?> createTeam(@RequestBody Teams team) {
        Teams createdTeam = teamService.createTeam(team);
        return new ResponseEntity<>(createdTeam, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<?> listTeams(Pageable pageable) {
        Page<Teams> teams = teamService.listTeams(pageable);
        return new ResponseEntity<>(teams, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findATeam(@PathVariable Long id) {
        Teams team = teamService.findATeam(id);
        return new ResponseEntity<>(team, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTeam(@PathVariable Long id, @RequestBody Teams team) {
        Teams updatedTeam = teamService.updateTeam(id, team);
        return new ResponseEntity<>(updatedTeam, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTeam(@PathVariable Long id) {
        teamService.deleteTeam(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
} 