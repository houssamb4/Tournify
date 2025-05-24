
# Base Test Classes:
- BaseTest.java: Abstract base class with common test configuration (uses @SpringBootTest and @ActiveProfiles("test"))

# Controller Tests:
- PlayerControllerTest.java: Tests for Player controller endpoints (currently disabled)
    - testGetPlayerById(): Tests GET /api/players/{id}
    - testGetPlayersByTeamId(): Tests GET /api/players/team/{id}
    - testCreatePlayer(): Tests POST /api/players/create
    - testUpdatePlayer(): Tests PUT /api/players/{id}
    - testDeletePlayer(): Tests DELETE /api/players/{id}

# Service Tests:
- PlayerServiceTest.java: Tests for PlayerService implementation
    - Tests CRUD operations
    - Tests player-team relationships
    - Tests business logic and validation

# DAO/Repository Tests:
- PlayerDaoTest.java: Tests for Player repository
    - testSavePlayer(): Tests saving a player
    - testFindPlayerById(): Tests finding a player by ID
- TeamDaoTest.java: Tests for Team repository
- TournamentDaoTest.java: Tests for Tournament repository
    - testFindTournamentById()
    - testFindAllTournaments()

# Entity Tests:
- PlayersTest.java: Tests for Players entity
    - testCreatePlayer(): Tests entity creation and persistence
    - testPlayerPrePersistHook(): Tests @PrePersist hook
- TeamsTest.java: Tests for Teams entity
- TournamentTest.java: Tests for Tournament entity
    - testCreateTournament()
    - testTournamentPrePersistHook()

# Security Tests:
- JwtTokenProviderTest.java: Tests JWT token generation and validation
    - Tests token creation
    - Tests token validation
    - Tests user authentication

# Application Tests:
- TournamentApplicationTests.java: Main application test
    - contextLoads(): Tests that the Spring context loads
    - daoBeansLoad(): Tests that DAO beans are properly injected