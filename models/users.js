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
  niceHashApi: {
    type: Schema.Types.ObjectId,
    ref: 'NiceHashApi'
  },
  niceHashData:{
    type: Schema.Types.ObjectId,
    ref: 'NiceHashData'
  },
})


module.exports = mongoose.model('User', userSchema);