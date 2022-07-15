const { insertImage, getImageById, getAllImages, getImageByFileName, updateImage } = require("../services/imageService");
const fs = require('fs');
const path = require("path");
const { ObjectId } = require("mongodb");
const sizeOf = require('image-size').imageSize;

async function addImage(req, res, next) {
  if (!validateImageBodyOrfail(req, res)) return;

  try {
    const bufferImage = Buffer.from(req.body.image, "base64");
    const filePath = generateFilePath(bufferImage);

    // Check if file exists thanks to hashed file names
    if (fs.existsSync(filePath)) {
      const result = await getImageByFileName(generateFileName(bufferImage));
      return res.status(409).send({ error: "Image exists already", image: result });
    }

    // Proceed to save file to disk & database
    if (!fs.existsSync(generateDirectoryPath())) fs.promises.mkdir(generateDirectoryPath(), { recursive: true });
    await fs.promises.writeFile(filePath, bufferImage);
    const size = sizeOf(bufferImage);
    const insertResult = await insertImage(generateFileName(bufferImage), size.width, size.height, req.body.description, req.user);
    if (!insertResult.acknowledged) return res.status(500).send({ error: "Database insert failed" });

    // Return the newly inserted document
    const result = await getImageById(insertResult.insertedId);
    res.status(201).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
}

async function patchImage(req, res, next) {
  if (!validateImageBodyPatchOrfail(req, res)) return;

  try {
    let fieldsToUpdate = {};
    // Push fields to update regarding the image and its metadata
    if (req.body.image) {
      const bufferImage = Buffer.from(req.body.image, "base64");
      const filePath = generateFilePath(bufferImage);

      // Check if file exists thanks to hashed file names
      if (fs.existsSync(filePath)) {
        const result = await getImageByFileName(generateFileName(bufferImage));
        return res.status(409).send({ error: "Image exists already", image: result });
      }

      // Assign file name to update in database
      fieldsToUpdate.fileName = generateFileName(bufferImage);
      // Proceed to save file to disk
      if (!fs.existsSync(generateDirectoryPath())) fs.promises.mkdir(generateDirectoryPath(), { recursive: true });
      await fs.promises.writeFile(filePath, bufferImage);
      const { width, height } = sizeOf(bufferImage);
      fieldsToUpdate.width = width;
      fieldsToUpdate.height = height;
    }

    // Push description field
    if (req.body.description) fieldsToUpdate.description = req.body.description;

    // Update the document in the DB
    const updateResult = await updateImage(req.params.id, req.user, fieldsToUpdate);
    if (!updateResult.acknowledged) return res.status(500).send({ error: "Database update failed" });

    // Return the newly updated document
    const result = await getImageById(req.params.id);
    res.status(200).send(result);
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

// Utility functions

function validateImageBodyOrfail(req, res) {
  if (!req.body.image || !req.body.description || req.body.description.length < 10) {
    res.status(400).send({
      error: "Expected body with 'image' string(1+) and 'description' string(10+)"
    });
    return false;
  }
  return true;
}

function validateImageBodyPatchOrfail(req, res) {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).send({
      error: "Invalid object ID"
    });
    return false;
  }
  if (!req.body.image && (!req.body.description || req.body.description.length < 10)) {
    res.status(400).send({
      error: "Expected body with one of 'image' string(1+) or 'description' string(10+)"
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

function generateDirectoryPath() {
  return process.env.IMAGE_DIRECTORY || path.join(__dirname, "..", "public", "images");
}

function generateFilePath(buffer) {
  const fileName = generateFileName(buffer);
  const basePath = generateDirectoryPath();
  return path.join(basePath, fileName);
}

module.exports = { addImage, getImage, getImages, patchImage };