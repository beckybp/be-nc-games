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
      reviewArr.forEach((reveiw) => {
        reveiw.comment_count = parseInt(reveiw.comment_count);
      });
      return reviewArr;
    });
};
