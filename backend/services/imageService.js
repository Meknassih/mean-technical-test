const { ObjectId } = require("mongodb");
const { useDatabase } = require("./mongoService");

async function getImageById(imageId) {
  return useDatabase(async (db) => {
    return await db.collection("images").findOne({ _id: new ObjectId(imageId) });
  });
}

async function getImageByFileName(fileName) {
  return useDatabase(async (db) => {
    return await db.collection("images").findOne({ fileName });
  });
}

async function getAllImages() {
  return useDatabase(async (db) => {
    // Hard limit to 1000 documents to keep the project simple
    const cursor = await db.collection("images").find({}, { limit: 1000 });
    return await cursor.toArray();
  });
}

async function insertImage(fileName, width, height, description, owner) {
  return useDatabase(async (db) => {
    return await db.collection("images").insertOne({
      fileName,
      width,
      height,
      description,
      owner
    });
  });
}

async function updateImage(id, owner, partialDocument) {
  return useDatabase(async (db) => {
    return await db.collection("images").updateOne({ _id: new ObjectId(id) }, {
      $set: {
        owner,
        ...partialDocument
      }
    });
  });
}

module.exports = { getImageById, getAllImages, insertImage, getImageByFileName, updateImage };