const { selectReviewFromId } = require("../models/reviews-models.js");

exports.handle404BadPath = (req, res, next) => {
  res.status(404).send({ msg: "Path not found" });
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handlePSQL400Errors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "Bad request - incomplete information" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "Not found" });
  } else next(err);
};

exports.handle500Status = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
};
