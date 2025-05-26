package com.Football.Tournament.controller;

import com.Football.Tournament.dto.ApiResponse;
import com.Football.Tournament.dto.GameDto;
import com.Football.Tournament.response.ResponseHandler;
import com.Football.Tournament.services.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/home")
public class GameController {

    private final GameService gameService;

    @Autowired
    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @GetMapping("/games")
    public ResponseEntity<Object> getAllGames(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<GameDto> games = gameService.getAllGames(pageable);
        
        return ResponseHandler.generateResponse(
            HttpStatus.OK, 
            "Success", 
            new ApiResponse<>(true, "Games retrieved successfully", games)
        );
    }

    @GetMapping("/games/{id}")
    public ResponseEntity<Object> getGameById(@PathVariable Long id) {
        GameDto game = gameService.getGameById(id);
        
        return ResponseHandler.generateResponse(
            HttpStatus.OK, 
            "Success", 
            new ApiResponse<>(true, "Game retrieved successfully", game)
        );
    }

    @GetMapping("/games/genre/{genreName}")
    public ResponseEntity<Object> getGamesByGenre(
            @PathVariable String genreName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<GameDto> games = gameService.getGamesByGenre(genreName, pageable);
        
        return ResponseHandler.generateResponse(
            HttpStatus.OK, 
            "Success", 
            new ApiResponse<>(true, "Games retrieved successfully", games)
        );
    }

    @GetMapping("/games/search")
    public ResponseEntity<Object> searchGames(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<GameDto> games = gameService.searchGames(query, pageable);
        
        return ResponseHandler.generateResponse(
            HttpStatus.OK, 
            "Success", 
            new ApiResponse<>(true, "Games retrieved successfully", games)
        );
    }

    @PostMapping("/games")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> createGame(@RequestBody GameDto gameDto) {
        GameDto createdGame = gameService.createGame(gameDto);
        
        return ResponseHandler.generateResponse(
            HttpStatus.CREATED, 
            "Success", 
            new ApiResponse<>(true, "Game created successfully", createdGame)
        );
    }

    @PutMapping("/games/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> updateGame(
            @PathVariable Long id,
            @RequestBody GameDto gameDto) {
        
        GameDto updatedGame = gameService.updateGame(id, gameDto);
        
        return ResponseHandler.generateResponse(
            HttpStatus.OK, 
            "Success", 
            new ApiResponse<>(true, "Game updated successfully", updatedGame)
        );
    }

    @DeleteMapping("/games/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> deleteGame(@PathVariable Long id) {
        gameService.deleteGame(id);
        
        return ResponseHandler.generateResponse(
            HttpStatus.NO_CONTENT, 
            "Success", 
            new ApiResponse<>(true, "Game deleted successfully", null)
        );
    }
}
