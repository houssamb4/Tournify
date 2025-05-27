-- Drop database if it exists
DROP DATABASE IF EXISTS tournify_db;

-- Create database
CREATE DATABASE tournify_db;

-- Use the database
USE tournify_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    address VARCHAR(255),
    age INT,
    avatar VARCHAR(255),
    games_played INT,
    games_won INT,
    games_lost INT,
    gender VARCHAR(255),
    last_login DATETIME(6),
    marketing_emails BIT(1),
    notifications BIT(1),
    phone VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create games table
CREATE TABLE IF NOT EXISTS games (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon TEXT,
    activePlayersCount VARCHAR(255),
    developer VARCHAR(100),
    game_genre VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    created_at DATETIME(6) NOT NULL,
    location VARCHAR(255) NOT NULL,
    logo_url VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    updated_at DATETIME(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create players table
CREATE TABLE IF NOT EXISTS players (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    age INT NOT NULL,
    created_at DATETIME(6) NOT NULL,
    name VARCHAR(255) NOT NULL,
    profile_url VARCHAR(255),
    updated_at DATETIME(6) NOT NULL,
    team_id BIGINT NOT NULL,
    FOREIGN KEY (team_id) REFERENCES teams(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create tournaments table
CREATE TABLE IF NOT EXISTS tournaments (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    created_at DATETIME(6) NOT NULL,
    end_date DATE,
    logo_url VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    start_date DATE,
    updated_at DATETIME(6) NOT NULL,
    game_id BIGINT UNSIGNED,
    FOREIGN KEY (game_id) REFERENCES games(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create tournaments_teams join table
CREATE TABLE IF NOT EXISTS tournaments_teams (
    tournament_id BIGINT NOT NULL,
    team_id BIGINT NOT NULL,
    PRIMARY KEY (tournament_id, team_id),
    FOREIGN KEY (tournament_id) REFERENCES tournaments(id),
    FOREIGN KEY (team_id) REFERENCES teams(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create password_reset table
CREATE TABLE IF NOT EXISTS password_reset (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    expiry_date DATETIME(6) NOT NULL,
    used BIT(1) NOT NULL,
    verification_code VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default admin user (password: admin123)
INSERT IGNORE INTO users (
    id, username, email, password, first_name, last_name, role,
    created_at, updated_at, address, phone, notifications, marketing_emails
) VALUES (
    1, 'admin', 'admin@tournify.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'Admin', 'User', 'ROLE_ADMIN',
    NOW(), NOW(), '123 Admin Street', '+1234567890', 1, 0
);

-- Insert sample games
INSERT IGNORE INTO games (id, name, game_genre) VALUES
(1, 'Football', 'Sports'),
(2, 'Basketball', 'Sports'),
(3, 'Cricket', 'Sports'),
(4, 'Tennis', 'Sports');

-- Clean up any existing roles
DELETE FROM roles;

-- Insert required roles
INSERT INTO roles (id, name) VALUES
(1, 'ROLE_USER'),
(2, 'ROLE_ADMIN');

-- Additional tables that might be needed by the application
-- Create team_members table for many-to-many relationship between users and teams
CREATE TABLE IF NOT EXISTS team_members (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    team_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    role VARCHAR(20) DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_team_member (team_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create matches table for tournament matches
CREATE TABLE IF NOT EXISTS matches (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    tournament_id BIGINT NOT NULL,
    team1_id BIGINT NOT NULL,
    team2_id BIGINT NOT NULL,
    scheduled_time DATETIME(6) NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled',
    winner_id BIGINT,
    score_team1 INT DEFAULT 0,
    score_team2 INT DEFAULT 0,
    round_number INT NOT NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
    FOREIGN KEY (team1_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (team2_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (winner_id) REFERENCES teams(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BIT(1) DEFAULT 0,
    created_at DATETIME(6) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Grant privileges
GRANT ALL PRIVILEGES ON tournify_db.* TO 'avnadmin'@'%';
FLUSH PRIVILEGES;
