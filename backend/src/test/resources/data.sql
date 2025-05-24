-- Delete existing data first to avoid primary key conflicts
DELETE FROM tournament_teams;
DELETE FROM players;
DELETE FROM teams;
DELETE FROM tournaments;
DELETE FROM users;

-- Insert test users without specifying IDs to let H2 handle auto-increment
INSERT INTO users (username, email, password, first_name, last_name, role, created_at, updated_at) 
VALUES ('testadmin', 'testadmin@example.com', '$2a$10$f.jsbQW7.kWcxRONbcGcZOzPzh7kODBI6s9uHgSJVVBvRgNOYmyLq', 'Admin', 'User', 'ROLE_ADMIN', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

INSERT INTO users (username, email, password, first_name, last_name, role, created_at, updated_at) 
VALUES ('testuser', 'testuser@example.com', '$2a$10$f.jsbQW7.kWcxRONbcGcZOzPzh7kODBI6s9uHgSJVVBvRgNOYmyLq', 'Test', 'User', 'ROLE_USER', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

-- Insert test tournaments - using the correct fields for the actual table structure
INSERT INTO tournaments (name, logo_url, start_date, end_date, created_at, updated_at)
VALUES ('Test Tournament 1', 'https://example.com/logo1.png', '2025-01-01', '2025-02-01', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

INSERT INTO tournaments (name, logo_url, start_date, end_date, created_at, updated_at)
VALUES ('Test Tournament 2', 'https://example.com/logo2.png', '2025-03-01', '2025-04-01', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

-- Insert test teams - using the correct fields for the actual table structure
INSERT INTO teams (name, location, logo_url, created_at, updated_at)
VALUES ('Test Team 1', 'Test Location 1', 'https://example.com/team1.png', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

INSERT INTO teams (name, location, logo_url, created_at, updated_at)
VALUES ('Test Team 2', 'Test Location 2', 'https://example.com/team2.png', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

-- Wait for IDs to be generated
SET @team1_id = (SELECT id FROM teams WHERE name = 'Test Team 1');
SET @team2_id = (SELECT id FROM teams WHERE name = 'Test Team 2');
SET @tournament1_id = (SELECT id FROM tournaments WHERE name = 'Test Tournament 1');
SET @tournament2_id = (SELECT id FROM tournaments WHERE name = 'Test Tournament 2');

-- Insert test players (Note: explicitly setting ID will be handled by PlayerServiceImpl's workaround)
INSERT INTO players (name, age, team_id, profile_url, created_at, updated_at)
VALUES ('Test Player 1', 25, @team1_id, 'https://example.com/player1.png', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

INSERT INTO players (name, age, team_id, profile_url, created_at, updated_at)
VALUES ('Test Player 2', 28, @team1_id, 'https://example.com/player2.png', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

INSERT INTO players (name, age, team_id, profile_url, created_at, updated_at)
VALUES ('Test Player 3', 30, @team2_id, 'https://example.com/player3.png', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

-- Add teams to tournaments
INSERT INTO tournament_teams (tournament_id, teams_id)
VALUES (@tournament1_id, @team1_id), (@tournament1_id, @team2_id), (@tournament2_id, @team2_id);
