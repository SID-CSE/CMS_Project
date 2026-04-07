# Contify CMS Backend

This is the Spring Boot backend for Contify CMS.

It manages authentication, role-based workflow APIs, notifications, and persistence with MySQL.

## Status

This module is under active development.

Major workflow stages and JWT auth are implemented, and additional hardening/features are planned.

## Tech Stack

- Java 21
- Spring Boot 4
- Spring Data JPA
- Spring Security
- JWT (jjwt)
- MySQL

## Core Capabilities

- User registration and login with JWT token generation
- Password hashing with BCrypt
- Stakeholder project request APIs
- Admin proposal and task management APIs
- Editor task submission APIs
- Stakeholder approval/sign-off APIs
- Notification APIs

## Prerequisites

- Java 21+
- MySQL 8+
- Maven (or use wrapper)

## Setup

1. Create database:

```sql
CREATE DATABASE Contify;
```

2. Configure database and JWT settings in:

- `src/main/resources/application.properties`

3. Start server:

```bash
mvnw spring-boot:run
```

Server runs on:
- http://localhost:9090

## Important Configuration

From `application.properties`:
- `spring.datasource.url`
- `spring.datasource.username`
- `spring.datasource.password`
- `app.jwt.secret`
- `app.jwt.expiration-ms`

## API Base

- `http://localhost:9090/api`

## Default Seed Users

Created on first run:
- `client@contify.com` (stakeholder)
- `admin@contify.com` (admin)
- `editor@contify.com` (editor)

Default seeded password:
- `password123`

## Build and Test

```bash
mvnw clean compile
mvnw test
```

## API Reference

Detailed endpoint documentation is available in:

- `API_DOCUMENTATION.md`

## Security Notes

- Passwords are stored as hashes (`password_hash`), not plain text.
- JWT is stateless and validated on protected endpoints.
- Replace default JWT secret before production deployment.

## Next Planned Improvements

- Stronger role-based method security annotations
- Refresh token flow
- File upload/storage integration (S3/Blob)
- More integration and security tests
- Deployment profiles and CI/CD automation
