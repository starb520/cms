const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const sequenceSchema = new Schema({
  maxDocumentId: { type: Number, required: true },
  maxMessageId: { type: Number, required: true },
  maxContactId: { type: Number, required: true }
});

module.exports = mongoose.model('Sequence', sequenceSchema);
