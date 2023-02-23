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
