const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const niceHashDataSchema = new Schema({
  miningRigs: {
    type: String
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
});

module.exports = mongoose.model('NiceHashData', niceHashDataSchema);
