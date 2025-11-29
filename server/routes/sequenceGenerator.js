const Sequence = require('../models/sequence');

let maxDocumentId;
let maxMessageId;
let maxContactId;
let sequenceId = null;

class SequenceGenerator {
  constructor() {
    this.initialize();
  }

  async initialize() {
    try {
      const sequence = await Sequence.findOne().exec();
      if (!sequence) {
        console.log("No sequence record found in database.");
        return;
      }

      sequenceId = sequence._id;
      maxDocumentId = sequence.maxDocumentId;
      maxMessageId = sequence.maxMessageId;
      maxContactId = sequence.maxContactId;

    } catch (err) {
      console.error("Sequence initialization error:", err);
    }
  }

  async nextId(collectionType) {
    let updateObject = {};
    let nextId;

    switch (collectionType) {
      case 'documents':
        maxDocumentId++;
        updateObject = { maxDocumentId };
        nextId = maxDocumentId;
        break;

      case 'messages':
        maxMessageId++;
        updateObject = { maxMessageId };
        nextId = maxMessageId;
        break;

      case 'contacts':
        maxContactId++;
        updateObject = { maxContactId };
        nextId = maxContactId;
        break;

      default:
        return -1;
    }

    try {
      await Sequence.updateOne(
        { _id: sequenceId },
        { $set: updateObject }
      ).exec();
    } catch (err) {
      console.error("nextId update error:", err);
      return null;
    }

    return nextId;
  }
}

module.exports = new SequenceGenerator();
