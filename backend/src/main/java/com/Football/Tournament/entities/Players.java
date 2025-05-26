package com.Football.Tournament.entities;

import java.util.Date;

import javax.persistence.*;

import org.hibernate.annotations.DynamicUpdate;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@DynamicUpdate
@Table(name = "players")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Players {
	
	//PRIMARY KEY 
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false, updatable = false)
	private long id;
	@Column(nullable = false) //SETTING NOT NULL PROPERTY TO THE COLUMN
	private String name;
	@Column(nullable = false)
	private int age;
	@Column(name = "profile_url")
	private String profileUrl;
	@Temporal(TemporalType.TIMESTAMP)
	@Column(nullable = false)
	private Date created_at;
	@Temporal(TemporalType.TIMESTAMP)
	@Column(nullable = false)
	private Date updated_at;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "team_id", nullable = false)
	@JsonIgnore
	private Teams team;

	@JsonProperty("team_id")
	private transient long team_id;

	@PrePersist //THIS WILL RUN JUST BEFORE CREATION OF NEW PLAYER AND WILL SET THE DATE AND TIME OF CREATION
	private void onCreate() {
		created_at = new Date();//AT THE TIME OF CREATION :VALUE OF created_at=VALUE OF updated_at.
		updated_at = new Date();
		//SO BASICALLY created_at,updated_at AND Id WILL BE SET AUTOMATICALLY.
	}

	@PreUpdate //THIS WILL RUN JUST BEFORE UPDATION OF EXISTING PLAYER
	private void onUpdate() {
		updated_at = new Date();
	}

	public Players() {
		super();
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

	public int getAge() {
		return age;
	}

	public void setAge(int age) {
		this.age = age;
	}

	@JsonProperty("profile_url")
	public String getProfileUrl() {
		return profileUrl;
	}

	@JsonProperty("profile_url")
	public void setProfileUrl(String profileUrl) {
		this.profileUrl = profileUrl;
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

	public Teams getTeam() {
		return team;
	}

	public void setTeam(Teams team) {
		if (this.team != null) {
			this.team.getPlayers().remove(this);
		}
		this.team = team;
		if (team != null) {
			team.getPlayers().add(this);
		}
	}

	public long getTeam_id() {
		return team != null ? team.getId() : team_id;
	}

	public void setTeam_id(long team_id) {
		this.team_id = team_id;
		if (this.team == null) {
			this.team = new Teams();
		}
		this.team.setId(team_id);
	}

	public Players(long id, String name, int age, String profileUrl, Date created_at, Date updated_at, Teams team) {
		super();
		this.id = id;
		this.name = name;
		this.age = age;
		this.profileUrl = profileUrl;
		this.created_at = created_at;
		this.updated_at = updated_at;
		setTeam(team);
	}

	@Override
	public String toString() {
		return "Players{" +
				"id=" + id +
				", name='" + name + '\'' +
				", age=" + age +
				", profileUrl='" + profileUrl + '\'' +
				", team_id=" + team_id +
				"}";
	}

}
