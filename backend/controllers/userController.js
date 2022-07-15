const { insertUser, getUser } = require("../services/mongoService");

async function login(req, res, next) {
  if (!validateUserBodyOrFail(req, res)) return;
  try {
    // Get user by name
    const storedUser = await getUser(req.body.name);
    if (!storedUser) return res.status(404).send({ error: "User does not exist" })

    // Creating a HMAC digest of the user password to compare with stored one
    const hmac = require('crypto').createHmac('sha256', process.env.HMAC_SECRET);
    hmac.update(req.body.password);
    if (storedUser.password === hmac.digest("hex")) return res.status(200).send({ jwt: generateAccessToken(storedUser.name) });
    else return res.status(401).send({ error: "Wrong username or password" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
}

async function register(req, res, next) {
  if (!validateUserBodyOrFail(req, res)) return;
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

function validateUserBodyOrFail(req, res) {
  if (!req.body.name || !req.body.password || req.body.password.length < 3) {
    res.status(400).send({
      error: "Expected body with 'name' string(1+) and 'password' string(3+)"
    });
    return false;
  }
  return true;
}

function generateAccessToken(name) {
  return require('jsonwebtoken').sign({ user: name }, process.env.JWT_SECRET, { expiresIn: 1800 });
}

module.exports = { login, register };