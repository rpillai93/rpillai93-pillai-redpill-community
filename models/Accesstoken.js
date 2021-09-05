const mongoose = require('mongoose');
const AccesstokenSchema = new mongoose.Schema({
tokenval: {
  type: String,
},
user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'user'
},
date: {
  type: Date,
  default: Date.now
}

});

module.exports = Accesstoken = mongoose.model('accesstoken',AccesstokenSchema);
