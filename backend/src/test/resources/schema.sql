-- Define schema for H2 test database
-- H2 has MySQL compatibility mode but some aspects need to be explicitly defined

-- Drop tables in reverse order of dependencies
DROP TABLE IF EXISTS tournament_teams;
DROP TABLE IF EXISTS players;
DROP TABLE IF EXISTS teams;
DROP TABLE IF EXISTS tournaments;
DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS password_reset_tokens;
DROP TABLE IF EXISTS users;

-- Create tables in order of dependencies
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    age INTEGER,
    phone VARCHAR(255),
    gender VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    avatar VARCHAR(255),
    last_login TIMESTAMP,
    marketing_emails BOOLEAN,
    notifications BOOLEAN,
    role VARCHAR(50) NOT NULL,
    status VARCHAR(50),
    games_played INTEGER,
    games_won INTEGER,
    games_lost INTEGER,
    win_percentage VARCHAR(10)
);

CREATE TABLE games (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(255),
    developer VARCHAR(255),
    game_genre VARCHAR(255)
);

CREATE TABLE tournaments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo_url VARCHAR(255),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    game_id BIGINT,
    FOREIGN KEY (game_id) REFERENCES games(id)
);

CREATE TABLE teams (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    logo_url VARCHAR(255),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE players (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INTEGER NOT NULL,
    profile_url VARCHAR(255),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    team_id BIGINT NOT NULL,
    FOREIGN KEY (team_id) REFERENCES teams(id)
);

CREATE TABLE tournament_teams (
    tournament_id BIGINT NOT NULL,
    team_id BIGINT NOT NULL,
    PRIMARY KEY (tournament_id, team_id),
    FOREIGN KEY (tournament_id) REFERENCES tournaments(id),
    FOREIGN KEY (team_id) REFERENCES teams(id)
);

CREATE TABLE password_reset_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    verification_code VARCHAR(255) NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE
);
