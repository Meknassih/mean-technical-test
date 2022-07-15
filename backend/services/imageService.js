const { ObjectId } = require("mongodb");
const { useDatabase } = require("./mongoService");

async function getImageById(imageId) {
  return useDatabase(async (db) => {
    return await db.collection("images").findOne({ _id: new ObjectId(imageId) });
  });
}

async function insertImage(filename, width, height, description, owner) {
  return useDatabase(async (db) => {
    return await db.collection("images").insertOne({
      filename,
      width,
      height,
      description,
      owner
    });
  });
}

module.exports = { getImageById, insertImage };