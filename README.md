# SagasuCore

<!--TODO: Add ogo of project Sagasu-->

> **Core repository for project [Sagasu](https://github.com/TheSagasu), which provides services that are the most important.**

## Description

- This repository provides core feature of anime dialog search, including:
  - user authentication and authorization
  - communication with ElasticSearch backend
  - dialogs, episodes and series record management

Due to the key feature it takes place, so we DOES NOT have any plan to open source it recently, regardless we stop maintain this project.

> *Built by [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.*

## Installation

- To install this project, these environments are required:
  - `NodeJS` >= current LTS of v12 *(with `yarn` installed)*
  - `PostgresSQL`
  - `ElasticSearch` >= 7.12.0
  - `Redis` *Which is not been used yet, but will be required at any time.*

- Or you can just `docker-compose up` this project with [`docker-compose.yml`](./docker-compose.yml)

- Install dependencies

```bash
yarn install
```

- Configure `.env` file (or environment variable)
  - Create a `.env` file at project root, there are content for reference

```bash
DATABASE_URL=postgresql://postgres:password@localhost:5432/postgres 
ES_NODE=http://localhost:9200
REDIS_URL=redis://localhost:6379
JWT_SECRET=FuckYouMother # DOES NOT public it at any condition
```

- Run database migration

```bash
yarn run typeorm:run
```

## Running the app

```bash
# development
yarn run start

# watch mode
yarn run start:dev

# production mode
yarn run start:prod
```

## Test

**We are hiring member who could complete test cases for us!**

```bash
# unit tests
yarn run test

# e2e tests
yarn run test:e2e

# test coverage
yarn run test:cov
```

## Credits

- This project is based on [Nest](https://nestjs.com/), which is an MIT-licensed open source project.

- Search feature is powered by [ElasticSearch](https://elastic.co), thanks to its awesome search performance

- Current maintainer is [@mnixry](https://github.com/mnixry), who contributed too much work on it
