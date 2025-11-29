const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  id: { type: String, required: true },
  subject: { type: String },
  msgText: { type: String, required: true },

  // IMPORTANT: supports null, string, or ObjectId
  sender: { type: Schema.Types.Mixed }
});

module.exports = mongoose.model('Message', messageSchema);
