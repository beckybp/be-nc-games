const {
  selectReviews,
  selectReviewFromId,
  createComment,
  selectCommentsFromReview,
  updateVoteCount,
} = require("../models/reviews-models.js");

exports.getReviews = (req, res, next) => {
  selectReviews()
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviewFromId = (req, res, next) => {
  const reviewId = req.params.review_id;
  selectReviewFromId(reviewId)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsFromReview = (req, res, next) => {
  const reviewId = req.params.review_id;
  selectCommentsFromReview(reviewId)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchReview = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;
  updateVoteCount(review_id, inc_votes)
    .then((updatedReview) => {
      res.status(200).send({ review: updatedReview });
    })
    .catch((err) => {
      next(err);
    });
};
