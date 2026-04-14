# Contify CMS Backend

For complete project documentation, setup flow, architecture, and policies, use:

- `../README.md`

For endpoint details, use:

- `API_DOCUMENTATION.md`

This file only contains backend-local commands.

## Run (Development)

```bash
mvnw spring-boot:run
```

Backend default URL:
- http://localhost:9090

## Build and Test

```bash
mvnw clean compile
mvnw test
```

## Environment

- Runtime values should be in local `.env`
- Keep `.env.example` as template only
