const pg = require("pg");
const format = require("pg-format");
const db = require("../db/connection.js");

exports.selectReviews = () => {
  return db
    .query(
      `
      SELECT reviews.*, COUNT(comments.review_id) AS comment_count
      FROM reviews
      LEFT JOIN comments
      ON reviews.review_id = comments.review_id
      GROUP BY reviews.review_id
      ORDER BY reviews.created_at DESC;
      `
    )
    .then((result) => {
      const reviewArr = result.rows;
      reviewArr.forEach((review) => {
        review.comment_count = parseInt(review.comment_count);
      });
      return reviewArr;
    });
};

exports.selectReviewFromId = (reviewId) => {
  return db
    .query(
      `
  SELECT *
  FROM reviews
  WHERE review_id = $1
  `,
      [reviewId]
    )
    .then((result) => {
      return result.rows[0];
    });
};
