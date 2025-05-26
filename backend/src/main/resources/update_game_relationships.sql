-- This script updates the games table
-- First rename activePlayers to activePlayersCount
ALTER TABLE games CHANGE COLUMN activePlayers activePlayersCount VARCHAR(255);

-- Remove the tournaments column from games table since it's now a relationship
ALTER TABLE games DROP COLUMN tournaments;

-- No need to create a game_players junction table since we're using the existing relationship chain
-- Game -> Tournament -> Team -> Player
