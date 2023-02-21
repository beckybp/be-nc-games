const express = require("express");
const { getCategories } = require("./controllers/categories-conroller.js");
const { getReviews } = require("./controllers/reviews-controller.js");
const {
  handle500Status,
} = require("./controllers/error-handling-controller.js");

const app = express();

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.use(handle500Status);

module.exports = app;
