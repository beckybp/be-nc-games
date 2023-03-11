const {
  createComment,
  removeComment,
} = require("../models/comments-models.js");

exports.postCommentOnReview = (req, res, next) => {
  const { username, body } = req.body;
  const reviewId = req.params.review_id;
  createComment(username, body, reviewId)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteComment = (req, res, next) => {
  const reviewId = req.params.review_id;
  removeComment(reviewId)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
