const endpointsJson = require("../endpoints.json");

exports.getApi = (req, res, next) => {
  res.status(200).send(endpointsJson);
};
