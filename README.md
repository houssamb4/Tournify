# Tournify - Football Tournament Management System

Tournify is a comprehensive football tournament management system with admin and user interfaces for managing tournaments, teams, and players.

## Features

### User Side
- View tournaments list and details
- Browse teams and player information
- Search and filter functionality

### Admin Side
- **Full CRUD operations** for:
  - Tournaments
  - Teams
  - Players
- Advanced tournament management
- User management system

## Technologies

- **Backend**: Spring Boot (Java 17)
- **Database**: MySQL 8.0
- **API Documentation**: Swagger 2.0
- **Build Tool**: Maven

## Installation

### Prerequisites
- Java 17 JDK
- MySQL 8.0+
- Maven 3.6+

### Setup Steps

1. Clone the repository:
```bash
git clone https://github.com/houssamb4/tournify.git
```

2. Create the MySQL database:

```sql
CREATE DATABASE tournify;
```

3. Configure database credentials in `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/tournify
spring.datasource.username=yourusername
spring.datasource.password=yourpassword
```

4. Build and run the application:

```bash
mvn spring-boot:run
```

## API Documentation

Access Swagger UI at:

http://localhost:8080/swagger-ui/

## Database Schema

### Teams Table
```sql
CREATE TABLE teams (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    created_at DATETIME,
    updated_at DATETIME
);
```

### Players Table
```sql
CREATE TABLE players (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INT,
    team_id BIGINT,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (team_id) REFERENCES teams(id)
);
```

## Key Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/teams` | Create new team |
| GET | `/api/teams` | List all teams (paginated) |
| GET | `/api/teams/{id}` | Get team details |
| PUT | `/api/teams/{id}` | Update team |
| DELETE | `/api/teams/{id}` | Delete team |
| POST | `/api/players` | Create new player |
| GET | `/api/players/by-team/{teamId}` | Get players by team |

## Usage Examples

### Create Team
```bash
curl -X POST "http://localhost:8080/api/teams" \
-H "Content-Type: application/json" \
-d '{"name": "Awesome FC", "location": "New York"}'
```

### Get Players by Team
```bash
curl -X GET "http://localhost:8080/api/players/by-team/1"
```

## Contributing

- Fork the project
- Create your feature branch (`git checkout -b feature/AmazingFeature`)
- Commit your changes (`git commit -m 'Add some AmazingFeature'`)
- Push to the branch (`git push origin feature/AmazingFeature`)
- Open a Pull Request

## License

Distributed under the MIT License. See LICENSE for more information.
