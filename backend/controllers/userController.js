const { insertUser, getUser } = require("../services/mongoService");

async function login(req, res, next) {

}

async function register(req, res, next) {
  if (!req.body.name || !req.body.password || req.body.password.length < 3) res.status(400).send({
    error: "Expected body with 'name' string(1+) and 'password' string(3+)"
  });
  let result;
  try {
    // Check if user exists
    result = await getUser(req.body.name);
    if (result) return res.status(409).send({ error: "User already exists" })

    // Creating a HMAC digest of the user password for safe storage
    const hmac = require('crypto').createHmac('sha256', process.env.HMAC_SECRET);
    hmac.update(req.body.password);
    result = await insertUser(req.body.name, hmac.digest("hex"));
    res.status(201).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
}

module.exports = { login, register };