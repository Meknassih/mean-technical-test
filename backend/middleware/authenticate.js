const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.set("WWW-Authenticate", "Bearer realm=\"MTL\"").sendStatus(401);
  const token = authHeader.split(' ')[1];
  if (!token) return res.set("WWW-Authenticate", "Bearer realm=\"MTL\"").sendStatus(401);

  req.credentials = jwt.verify(token, process.env.JWT_SECRET);
  next();
}

module.exports = { authenticate };