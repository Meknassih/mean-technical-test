const { ping } = require("../services/mongoService");

async function getHealthCheck(req, res, next) {
  let result;
  try {
    result = await ping();
    res.status(200).send({
      ok: 1,
      mongo: result
    });
  } catch (error) {
    res.status(500).send(error);
  }
}

module.exports = { getHealthCheck };