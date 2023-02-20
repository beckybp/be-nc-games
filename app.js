const express = require('express');
const { getCategories } = require('./controllers/games-conroller.js');
const { handle500Status } = require('./controllers/error-handling-controller.js');

const app = express();
app.use(express.json());

app.get('/api/categories', getCategories);

app.use(handle500Status);

module.exports = app;