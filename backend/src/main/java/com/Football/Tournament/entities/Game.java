package com.Football.Tournament.entities;

import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "games")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Game {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String icon;
    private String developer;
    private String gameGenre;
    
    
    // Relationship with tournaments that feature this game
    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("game")
    private List<Tournament> tournaments = new ArrayList<>();
    
    // Helper methods for managing tournament relationship
    public void addTournament(Tournament tournament) {
        tournaments.add(tournament);
        tournament.setGame(this);
    }
    
    public void removeTournament(Tournament tournament) {
        tournaments.remove(tournament);
        tournament.setGame(null);
    }
}
