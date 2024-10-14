const mongoose = require('mongoose');
const File = require('../models/File');

exports.saveFile = async (fileData) => {
  const file = new File(fileData);
  await file.save();
  return file;
};

exports.getFile = async (fileId) => {
  const file = await File.findById(fileId);
  if (!file) {
    throw new Error('File not found');
  }
  return file;
};

exports.streamFile = (fileId) => {
  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db);
  return bucket.openDownloadStream(mongoose.Types.ObjectId(fileId));
};