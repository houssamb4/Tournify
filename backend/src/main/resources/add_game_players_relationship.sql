-- Rename activePlayers column to activePlayersCount
ALTER TABLE games CHANGE COLUMN activePlayers activePlayersCount VARCHAR(255);

-- Drop the tournaments column from games table since it's now a relationship
ALTER TABLE games DROP COLUMN tournaments IF EXISTS;

-- Note: We are not creating a game_players junction table anymore
-- We will use the relationship chain: Game → Tournament → Team → Player
-- to find players for a game
