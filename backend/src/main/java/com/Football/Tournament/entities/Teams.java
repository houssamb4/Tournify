package com.Football.Tournament.entities;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import javax.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

@Entity
@Table(name = "Teams")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Teams {
	@Id
	@Column(name = "id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	@Column(nullable = false)
	private String name;
	@Column(nullable = false)
	private String location;
	@Column(name = "logo_url")
	private String logoUrl;
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "created_at", nullable = false, updatable = false)
	private Date created_at;
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "updated_at", nullable = false)
	private Date updated_at;

	@PrePersist
	protected void onCreate() {
		created_at = new Date();
		updated_at = new Date();
	}

	@PreUpdate
	protected void onUpdate() {
		updated_at = new Date();
	}
	//FOR ONE TO MANY UNIDIRECTIONAL MAPPING 
	@OneToMany(mappedBy = "team", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Players> players = new ArrayList<>();

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

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getLogoUrl() {
		return logoUrl;
	}

	public void setLogoUrl(String logoUrl) {
		this.logoUrl = logoUrl;
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

	public Teams() {
		super();
		
	}

	@ManyToMany(mappedBy = "teams")
	@JsonIgnore
	private Set<Tournament> tournaments = new HashSet<>();

	public Set<Tournament> getTournaments() {
		return tournaments;
	}

	public void setTournaments(Set<Tournament> tournaments) {
		this.tournaments = tournaments;
	}

	public List<Players> getPlayers() {
		return players;
	}

	public void setPlayers(List<Players> players) {
		this.players = players;
	}

	public Teams(long id, String name, String location, String logoUrl, Date created_at, Date updated_at) {
		super();
		this.id = id;
		this.name = name;
		this.location = location;
		this.logoUrl = logoUrl;
		this.created_at = created_at;
		this.updated_at = updated_at;
	}

}
