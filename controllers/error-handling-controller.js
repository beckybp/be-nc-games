exports.handle404BadPath = (req, res, next) => {
  res.status(404).send({ msg: "Path not found" });
};

exports.handle500Status = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};
