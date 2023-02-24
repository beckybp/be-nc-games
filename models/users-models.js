const pg = require("pg");
const format = require("pg-format");
const db = require("../db/connection.js");

exports.selectUsers = () => {
  return db
    .query(
      `
        SELECT *
        FROM users;
        `
    )
    .then((res) => {
      return res.rows;
    });
};
