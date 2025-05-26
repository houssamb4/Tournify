package com.Football.Tournament.dto;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameDto {
    private Long id;
    private String name;
    private String icon;
    private String developer;
    private String gameGenre;
    
    // Lists to hold related tournaments and players
    private List<TournamentSummaryDto> tournaments = new ArrayList<>();
    private Set<PlayerSummaryDto> players = new HashSet<>();
    
    // Count fields for summary information
    private int tournamentCount;
    private int playerCount;
    
    // Simple DTO classes for nested objects
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TournamentSummaryDto {
        private Long id;
        private String name;
        private String logoUrl;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PlayerSummaryDto {
        private Long id;
        private String name;
        private String profileUrl;
    }
}
