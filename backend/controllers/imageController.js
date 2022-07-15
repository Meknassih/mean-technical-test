const { insertImage, getImageById, getAllImages } = require("../services/imageService");
const fs = require('fs');
const path = require("path");
const { ObjectId } = require("mongodb");
const sizeOf = require('image-size').imageSize;

async function addImage(req, res, next) {
  if (!validateImageBodyOrfail(req, res)) return;

  try {
    const bufferImage = Buffer.from(req.body.image, "base64");
    const filePath = generateFilePath(bufferImage);
    if (!fs.existsSync(generateFileDirPath())) fs.promises.mkdir(generateFileDirPath(), { recursive: true });
    await fs.promises.writeFile(filePath, bufferImage);
    const size = sizeOf(bufferImage);
    const result = await insertImage(generateFileName(bufferImage), size.width, size.height, req.body.description, req.user);
    res.status(201).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
}

async function getImage(req, res, next) {
  if (!ObjectId.isValid(req.params.id)) return res.status(400).send({ error: "Invalid object ID" });
  try {
    const result = await getImageById(req.params.id);
    if (result) res.status(200).send(result);
    else res.status(404).send();
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
}

async function getImages(req, res, next) {
  try {
    const result = await getAllImages();
    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
}

function validateImageBodyOrfail(req, res) {
  if (!req.body.image || !req.body.description || req.body.description.length < 10) {
    res.status(400).send({
      error: "Expected body with 'image' string(1+) and 'description' string(10+)"
    });
    return false;
  }
  return true;
}

function generateFileName(buffer) {
  const size = sizeOf(buffer);
  const hash = require('crypto').createHash('sha256');
  hash.update(buffer);
  return `${hash.digest("hex")}.${size.type}`;
}

function generateFileDirPath() {
  return process.env.IMAGE_DIRECTORY || path.join(__dirname, "..", "public", "images");
}

function generateFilePath(buffer) {
  const fileName = generateFileName(buffer);
  const basePath = generateFileDirPath();
  return path.join(basePath, fileName);
}

module.exports = { addImage, getImage, getImages };