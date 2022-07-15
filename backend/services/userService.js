const { useDatabase } = require("./mongoService");

async function getUser(name) {
  return useDatabase(async (db) => {
    return await db.collection("users").findOne({ name });
  });
}

async function insertUser(name, password) {
  return useDatabase(async (db) => {
    return await db.collection("users").insertOne({
      name,
      password
    });
  });
}

module.exports = { getUser, insertUser };