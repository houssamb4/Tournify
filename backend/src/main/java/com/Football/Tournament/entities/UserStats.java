package com.Football.Tournament.entities;

import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class UserStats {
    private Integer gamesPlayed;
    private Integer gamesWon;
    private Integer gamesLost;
    private String winPercentage;
}
