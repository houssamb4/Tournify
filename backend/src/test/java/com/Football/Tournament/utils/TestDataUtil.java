package com.Football.Tournament.utils;

import com.Football.Tournament.entities.*;
import java.util.Date;
import java.time.LocalDateTime;

public class TestDataUtil {
    
    public static User createTestUser() {
        User user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setPassword("password123");
        user.setRole("ROLE_USER");
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        return user;
    }

    public static Teams createTestTeam() {
        Teams team = new Teams();
        team.setId(1L);
        team.setName("Test Team");
        team.setLocation("Test Location");
        team.setLogoUrl("http://example.com/logo.png");
        team.setCreated_at(new Date());
        team.setUpdated_at(new Date());
        return team;
    }

    public static Players createTestPlayer(Teams team) {
        Players player = new Players();
        player.setId(1L);
        player.setName("Test Player");
        player.setAge(25);
        player.setTeam(team);
        player.setTeam_id(team.getId());
        player.setCreated_at(new Date());
        player.setUpdated_at(new Date());
        return player;
    }

    public static Tournament createTestTournament() {
        Tournament tournament = new Tournament();
        tournament.setId(1L);
        tournament.setName("Test Tournament");
        tournament.setLogoUrl("http://example.com/tournament-logo.png");
        tournament.setStartDate(new Date());
        tournament.setEndDate(new Date());
        tournament.setCreated_at(new Date());
        tournament.setUpdated_at(new Date());
        return tournament;
    }

    public static Game createTestGame() {
        Game game = new Game();
        game.setId(1L);
        game.setName("Test Game");
        game.setIcon("test-icon.png");
        game.setDeveloper("Test Developer");
        game.setGameGenre("Sports");
        return game;
    }
} 