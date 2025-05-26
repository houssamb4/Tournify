package com.Football.Tournament.entities;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "tournaments")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Tournament {
    
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(name = "logo_url")
    private String logoUrl;
    
    @Temporal(TemporalType.DATE)
    @Column(name = "start_date")
    private Date startDate;
    
    @Temporal(TemporalType.DATE)
    @Column(name = "end_date")
    private Date endDate;
    
    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date created_at;
    
    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date updated_at;
    
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
        name = "tournament_teams",
        joinColumns = @JoinColumn(name = "tournament_id"),
        inverseJoinColumns = @JoinColumn(name = "team_id")
    )
    private Set<Teams> teams = new HashSet<>();
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id")
    private Game game;
    
    @PrePersist
    private void onCreate() {
        created_at = new Date();
        updated_at = new Date();
    }
    
    @PreUpdate
    private void onUpdate() {
        updated_at = new Date();
    }
    
    // Constructors
    public Tournament() {
        super();
    }
    
    public Tournament(long id, String name, String logoUrl, Date startDate, Date endDate, 
                     Date created_at, Date updated_at, Game game) {
        super();
        this.id = id;
        this.name = name;
        this.logoUrl = logoUrl;
        this.startDate = startDate;
        this.endDate = endDate;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.game = game;
    }
    
    public long getId() {
        return id;
    }
    
    public void setId(long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getLogoUrl() {
        return logoUrl;
    }
    
    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }
    
    public Date getStartDate() {
        return startDate;
    }
    
    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }
    
    public Date getEndDate() {
        return endDate;
    }
    
    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }
    
    public Date getCreated_at() {
        return created_at;
    }
    
    public void setCreated_at(Date created_at) {
        this.created_at = created_at;
    }
    
    public Date getUpdated_at() {
        return updated_at;
    }
    
    public void setUpdated_at(Date updated_at) {
        this.updated_at = updated_at;
    }
    
    public Set<Teams> getTeams() {
        return teams;
    }
    
    public void setTeams(Set<Teams> teams) {
        this.teams = teams;
    }
    
    // Helper methods for managing teams
    public void addTeam(Teams team) {
        this.teams.add(team);
        team.getTournaments().add(this);
    }
    
    public void removeTeam(Teams team) {
        this.teams.remove(team);
        team.getTournaments().remove(this);
    }
    
    public Game getGame() {
        return game;
    }
    
    public void setGame(Game game) {
        this.game = game;
    }
}