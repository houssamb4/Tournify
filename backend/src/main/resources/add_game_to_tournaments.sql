-- Add game_id column to tournaments table with UNSIGNED BIGINT to match auto-increment primary keys
ALTER TABLE tournaments ADD COLUMN game_id BIGINT UNSIGNED;

-- Add foreign key constraint
ALTER TABLE tournaments ADD CONSTRAINT fk_tournament_game 
FOREIGN KEY (game_id) REFERENCES games(id);

-- Update existing tournaments with game_id based on the data provided
UPDATE tournaments SET game_id = 2 WHERE id = 1; -- Free Fire Warriors -> Valorant
UPDATE tournaments SET game_id = 4 WHERE id = 2; -- Champion League -> League of Legends
UPDATE tournaments SET game_id = 6 WHERE id = 3; -- World Cup 2025 -> Fortnite
UPDATE tournaments SET game_id = 9 WHERE id = 4; -- Balance of Power -> Apex Legends
UPDATE tournaments SET game_id = 11 WHERE id = 8; -- Avca Covention -> Mobile Legends
UPDATE tournaments SET game_id = 13 WHERE id = 9; -- Kigs Lounge -> Call of Duty
UPDATE tournaments SET game_id = 14 WHERE id = 10; -- BGMI Open -> PUBG
UPDATE tournaments SET game_id = 18 WHERE id = 11; -- Creators Battle -> Free Fire
