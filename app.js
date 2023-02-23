const express = require("express");
const { getCategories } = require("./controllers/categories-conroller.js");
const {
  getReviews,
  getReviewFromId,
  getCommentsFromReview,
  patchComment,
} = require("./controllers/reviews-controller.js");
const {
  handle500Status,
  handle404BadPath,
  handleCustomErrors,
  handlePSQL400Errors,
} = require("./controllers/error-handling-controller.js");

const app = express();

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewFromId);

app.get("/api/reviews/:review_id/comments", getCommentsFromReview);

app.patch("/api/reviews/:review_id", patchComment);

app.use(handle404BadPath);

app.use(handleCustomErrors);

app.use(handlePSQL400Errors);

app.use(handle500Status);

module.exports = app;
