const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  webSocketId: {
    type: String,
    default: ''
  },
  NiceHashApi: {
    type: Schema.Types.ObjectId,
    ref: 'NiceHashApi'
  },
  NiceHashData:{
    type: Schema.Types.ObjectId,
    ref: 'NiceHashData'
  },
})


module.exports = mongoose.model('User', userSchema);