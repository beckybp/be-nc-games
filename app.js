const express = require("express");
const { getCategories } = require("./controllers/categories-conroller.js");
const {
  getReviews,
  getReviewFromId,
} = require("./controllers/reviews-controller.js");
const {
  handle500Status,
  handle404BadPath,
  handleCustomErrors,
  handlePSQL400Errors,
} = require("./controllers/error-handling-controller.js");
const { postCommentOnReview } = require("./controllers/comments-controller.js");

const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewFromId);

app.post("/api/reviews/:review_id/comments", postCommentOnReview);

app.use(handle404BadPath);

app.use(handleCustomErrors);

app.use(handlePSQL400Errors);

app.use(handle500Status);

module.exports = app;
