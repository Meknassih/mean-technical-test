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

module.exports = { ping, useDatabase };