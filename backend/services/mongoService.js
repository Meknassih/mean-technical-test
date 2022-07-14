const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URL;

const client = new MongoClient(uri);

console.log(`MongoDB client at ${uri}`);
async function useDatabase(handler) {
  try {
    await client.connect();
    return await handler(client.db("mtl"));
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await client.close();
  }
}

async function ping() {
  return useDatabase(async (db) => {
    return await db.command({ ping: 1 });
  });
}

async function getUser(name) {
  return useDatabase(async (db) => {
    return await db.collection("users").findOne({ name: name });
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

module.exports = { ping, getUser, insertUser };