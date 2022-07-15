const jwt = require('jsonwebtoken');
const { getUser } = require('../services/userService');

async function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.set("WWW-Authenticate", "Bearer realm=\"MTL\"").sendStatus(401);
  const token = authHeader.split(' ')[1];
  if (!token) return res.set("WWW-Authenticate", "Bearer realm=\"MTL\"").sendStatus(401);

  let jwtPayload;
  try {
    jwtPayload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(403).send({ error: "Invalid or expired JWT token" });
  }
  try {
    // @ts-ignore
    const { password, ...user } = await getUser(jwtPayload.user);
    req.user = user;
  } catch (error) {
    return res.status(500).send({ error: "Failed to retrieve authenticated user" });
  }
  next();
}

module.exports = { authenticate };