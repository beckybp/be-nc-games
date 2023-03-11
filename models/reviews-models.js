const pg = require("pg");
const format = require("pg-format");
const db = require("../db/connection.js");

checkCategoryExists = (category) => {
  return db
    .query(
      `
      SELECT *
      FROM categories
      WHERE slug = $1
      `,
      [category]
    )
    .then((result) => {
      const categories = result.rows;
      if (categories.length === 0) {
        return Promise.reject({
          status: 400,
          msg: `No review found`,
        });
      }
      return [];
    });
};

exports.selectReviews = (sort_by = "created_at", order = "desc", category) => {
  let queryStr = `
  SELECT reviews.*, COUNT(comments.review_id)::INT AS comment_count
  FROM reviews
  LEFT JOIN comments
  ON reviews.review_id = comments.review_id
  `;
  const queryParams = [];
  if (category) {
    queryStr += ` WHERE category = $1`;
    queryParams.push(category);
  }
  if (
    ![
      "title",
      "designer",
      "owner",
      "review_body",
      "category",
      "created_at",
      "votes",
    ].includes(sort_by)
  ) {
    return Promise.reject({ status: 400, msg: "Invalid sort query" });
  }
  if (!["asc", "desc"].includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  } else {
    queryStr += ` GROUP BY reviews.review_id
    ORDER BY ${sort_by} ${order}`;
  }
  return db.query(queryStr, queryParams).then((result) => {
    const reviewArr = result.rows;
    if (reviewArr.length === 0 && category) {
      return checkCategoryExists(category);
    }
    return reviewArr;
  });
};

exports.selectReviewFromId = (reviewId) => {
  return db
    .query(
      `
      SELECT reviews.*, COUNT(comments.review_id)::INT AS comment_count
      FROM reviews
      LEFT JOIN comments ON reviews.review_id = comments.review_id
      WHERE reviews.review_id = $1
      GROUP BY reviews.review_id;
      `,
      [reviewId]
    )
    .then((result) => {
      const review = result.rows[0];
      if (!review) {
        return Promise.reject({
          status: 404,
          msg: `No review found for review ${reviewId}`,
        });
      }
      return review;
    });
};

exports.selectCommentsFromReview = (reviewId) => {
  return db
    .query(
      `
      SELECT *
      FROM reviews
      WHERE review_id = $1;
      `,
      [reviewId]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No review found for review ${reviewId}`,
        });
      } else {
        return db
          .query(
            `
            SELECT *
            FROM comments
            WHERE review_id = $1
            ORDER BY comments.created_at DESC;
            `,
            [reviewId]
          )
          .then((res) => {
            return res.rows;
          });
      }
    });
};

exports.updateVoteCount = (review_id, inc_votes) => {
  if (inc_votes === undefined) {
    inc_votes = 0;
  }
  return db
    .query(
      `
  UPDATE reviews
  SET votes = votes + $2
  WHERE review_id = $1
  RETURNING *;
  `,
      [review_id, inc_votes]
    )
    .then((res) => {
      const review = res.rows[0];
      if (review === undefined) {
        return Promise.reject({
          status: 404,
          msg: `No review found for review ${review_id}`,
        });
      }
      return review;
    });
};
