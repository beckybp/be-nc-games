# Games Review API

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
