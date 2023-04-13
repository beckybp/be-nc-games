const express = require("express");
const cors = require("cors");
const { getCategories } = require("./controllers/categories-conroller.js");
const {
  getReviews,
  getReviewFromId,
  getCommentsFromReview,
  patchReview,
} = require("./controllers/reviews-controller.js");
const {
  handle500Status,
  handle404BadPath,
  handleCustomErrors,
  handlePSQL400Errors,
} = require("./controllers/error-handling-controller.js");
const {
  postCommentOnReview,
  deleteComment,
} = require("./controllers/comments-controller.js");
const { getUsers } = require("./controllers/users-controller");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewFromId);

app.post("/api/reviews/:review_id/comments", postCommentOnReview);

app.get("/api/reviews/:review_id/comments", getCommentsFromReview);

app.get("/api/users", getUsers);

app.patch("/api/reviews/:review_id", patchReview);

app.delete("/api/comments/:comment_id", deleteComment);

app.use(handle404BadPath);

app.use(handleCustomErrors);

app.use(handlePSQL400Errors);

app.use(handle500Status);

module.exports = app;
