# Games Review API

## Project overview

A solo project to create a fully tested, RESTful API for a games review website. This project provides information to the front-end, which can be found here: https://github.com/beckybp/fe-nc-games.

## Hosted version

The hosted API can be found by visiting the following link.

https://games-z0qy.onrender.com/api

I have added a list of endpoints below but please refer to the link above for more information on each of the endpoints.

- GET /api
- GET /api/categories
- GET /api/reviews
- GET /api/reviews/:review_id
- GET /api/reviews/:review_id/comments
- POST /api/reviews/:review_id/comments
- PATCH /api/reviews/:review_id
- GET /api/users
- DELETE /api/comments/:comment_id

## Instructions how to use this repository

To create your own copy of this repo, follow the steps below:

1. Clone the repo: `git clone https://github.com/beckybp/be-nc-games.git`
2. `cd` into the repo
3. Install the dependencies: `npm install`
4. To seed the local database: `npm seed`
5. To run tests: `npm test`

## How to connect to the test and development databases

The .env files have been added to the .gitignore file. In order to connect to the two databases locally you will need to create the following 2 files:

1. In a .env-development file you will need to add the following code:

```
PGDATABASE=nc_games
```

2. In a .env-test file you will need to add the following code:

```
PGDATABASE=nc_games_test
```

## Node and Postgres

You will need minimum versions of Node and Postgres to run this project locally. These are listed below:

- **Node.js:** v19
- **Postgres:** v14
