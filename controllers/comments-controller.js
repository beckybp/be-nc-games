const {
  createComment,
  removeComment,
  checkCommentExists,
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
  const commentId = req.params.comment_id;
  Promise.all([checkCommentExists(commentId), removeComment(commentId)])
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
