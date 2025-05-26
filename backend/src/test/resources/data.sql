-- Delete existing data first to avoid primary key conflicts
DELETE FROM tournament_teams;
DELETE FROM players;
DELETE FROM teams;
DELETE FROM tournaments;
DELETE FROM users;

-- Insert test game
INSERT INTO games (name, icon, developer, game_genre) 
VALUES ('Test Game', 'test-icon.png', 'Test Developer', 'Sports');

-- Insert test user (password is 'password' encoded with BCrypt)
INSERT INTO users (username, email, password, role, created_at, updated_at, status)
VALUES ('testuser', 'test@example.com', '$2a$10$ZKkUYE7YkR.1XB2iYQyE2.A/M3VzVfYS6YQB4Mr8VVGC71Yp6ZhCW', 'ROLE_USER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'active');

-- Insert test admin user
INSERT INTO users (username, email, password, role, created_at, updated_at, status)
VALUES ('admin', 'admin@example.com', '$2a$10$ZKkUYE7YkR.1XB2iYQyE2.A/M3VzVfYS6YQB4Mr8VVGC71Yp6ZhCW', 'ROLE_ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'active');

-- Insert test team
INSERT INTO teams (name, location, created_at, updated_at)
VALUES ('Test Team', 'Test Location', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert test player
INSERT INTO players (name, age, team_id, created_at, updated_at)
VALUES ('Test Player', 25, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert test tournament
INSERT INTO tournaments (name, logo_url, start_date, end_date, created_at, updated_at, game_id)
VALUES ('Test Tournament', 'test-logo.png', CURRENT_DATE, DATEADD('DAY', 30, CURRENT_DATE), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1);

-- Link team to tournament
INSERT INTO tournament_teams (tournament_id, team_id)
VALUES (1, 1);
