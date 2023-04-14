const pg = require("pg");
const format = require("pg-format");
const db = require("../db/connection.js");

exports.createComment = (username, body, reviewId) => {
  return db
    .query(
      `
    INSERT INTO comments
    (body, review_id, author)
    VALUES
    ($1, $2, $3)
    RETURNING *;
    `,
      [body, reviewId, username]
    )
    .then((res) => {
      return res.rows[0];
    });
};

exports.removeComment = (commentId) => {
  return db.query(
    `
    DELETE FROM comments
    WHERE comment_id = $1
    `,
    [commentId]
  );
};

exports.checkCommentExists = (commentId) => {
  return db
    .query(
      `
    SELECT * FROM comments 
    WHERE comment_id = $1
    `,
      [commentId]
    )
    .then((res) => {
      if (res.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No comment found for comment ${commentId}`,
        });
      }
    });
};
