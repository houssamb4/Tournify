package com.Football.Tournament.entities;

import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"username"}),
    @UniqueConstraint(columnNames = {"email"})
})
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = true,name = "first_name")
    private String firstName;

    @Column(nullable = true,name = "last_name")
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;
    
    private Integer age;

    private String phone;
    
    private String gender;

    private String address;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    private String avatar;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    @Column(name = "marketing_emails")
    private Boolean marketingEmails;

    private Boolean notifications;

    @Column(nullable = false)
    private String role;
    
    private String status;
    
    @Column(name = "games_played")
    private Integer gamesPlayed;
    
    @Column(name = "games_won")
    private Integer gamesWon;
    
    @Column(name = "games_lost")
    private Integer gamesLost;
    
    @Column(name = "win_percentage")
    private String winPercentage;
}
