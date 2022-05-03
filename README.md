# Microservice Products

## To starting the application

Create an external network with Docker

```bash
    docker network create services
```

To install dependencies

```bash
    docker-compose run --rm node npm i
```

To start the project and run

```bash
    docker-compose up
```

## Knex cli commands

```bash
    # To create a seed in typescript
    docker-compose run --rm node npm run ts-knex -- --knexfile=src/database/knexfile.ts seed:make -x ts seed-name

    # To run all migrations in typescript
    docker-compose run --rm node npm run ts-knex -- --knexfile=src/database/knexfile.ts migrate:latest

    # To rollback a single migration in typescript
    docker-compose run --rm node npm run ts-knex -- --knexfile=src/database/knexfile.ts migrate:rollback typescript

    # To run all seeds in typescript
    docker-compose run --rm node npm run ts-knex -- --knexfile=src/database/knexfile.ts seed:run 
```

## To running tests

```bash
    # To run tests normally
    docker-compose run --rm node npm run test 

    # To run tests in watch mode
    docker-compose run --rm node npm run test:watch 

    # To run tests in debug mode
    docker-compose run --rm node npm run test:debug 

    # To run tests with coverage report
    docker-compose run --rm node npm run test:cov 
```

## To running eslint

```bash
    docker-compose run --rm node npm run lint
```

## To up openapi swagger

```bash
    docker-compose -f docker-compose.swagger.yml up
```

### To validate swagger docs

```bash
    docker-compose -f docker-compose.swagger.yml run --rm swagger-tools swagger-cli validate api.yaml
```

### To generate swagger bundle

```bash
    docker-compose -f docker-compose.swagger.yml run --rm swagger-tools swagger-cli bundle -t yaml -o bundle.yaml api.yaml
```
