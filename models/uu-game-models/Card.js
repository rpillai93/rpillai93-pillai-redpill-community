const mongoose = require("mongoose");
const CardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  ctID: {
    type: Number,
    required: true,
  },
  stID: {
    type: Number,
    required: true,
  },
  src: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  cardWidth: {
    type: Number,
    required: true,
  },
  cardHeight: {
    type: Number,
    required: true,
  },
});

module.exports = CardSchema;
