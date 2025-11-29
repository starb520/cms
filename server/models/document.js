const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Child document (subdocument) schema
const childSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String },
  url: { type: String }
}, { _id: false });  // Disable auto _id for subdocuments


// Main document schema
const documentSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  url: { type: String },
  children: [childSchema]  // array of subdocuments
});

module.exports = mongoose.model('Document', documentSchema);
