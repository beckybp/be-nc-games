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

//Task 6

// exports.checkReviewExists = (reviewId) => {
//   return db.query(
//     `
//       SELECT *
//       FROM reviews
//       WHERE review_id = $1;
//       `,
//     [reviewId]
//   );
//   // .then((result) => {
//   //   if (result.rows.length === 0) {
//   //     return Promise.reject("review not found");
//   //   }
//   //   return result.rows;
//   // });
// };

// exports.selectCommentsFromReview = (reviewId) => {
//   checkReviewExists(reviewId).then((res) => {
//     let queryStr = `SELECT * FROM comments`;
//     const queryValues = [];
//     console.log(res);
//     if (res.rows.length !== 0) {
//       queryStr += ` WHERE review_id = $1`;
//       queryValues.push(reviewId);
//     } else {
//       return Promise.reject("review not found");
//     }
//   });

//   return db.query(queryStr, queryValues).then((res) => {
//     const rowCount = res.rowCount;
//     // console.log(rowCount);
//     if (rowCount === 0) {
//       return Promise.reject("review_id not found");
//     } else {
//       return result.rows;
//     }
//   });
// };

exports.selectCommentsFromReview = (reviewId) => {
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
    .then((result) => {
      const comments = result.rows;
      if (comments.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No review found for review ${reviewId}`,
        });
      }
      return comments;
    });
};
