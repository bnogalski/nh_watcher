const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const niceHashApiSchema = new Schema({
  publicKey: {
    type: String,
    required: true,
  },
  privateKey: {
    type: String,
    required: true,
  },
  organizationId: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
});

module.exports = mongoose.model('NiceHashApi', niceHashApiSchema);
