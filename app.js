const express = require("express");
const { getCategories } = require("./controllers/categories-conroller.js");
const {
  getReviews,
  getReviewFromId,
} = require("./controllers/reviews-controller.js");
const {
  handle500Status,
  handle404BadPath,
} = require("./controllers/error-handling-controller.js");

const app = express();

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewFromId);

app.use(handle404BadPath);

app.use(handle500Status);

module.exports = app;
